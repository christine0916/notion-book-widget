const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 알라딘 책 검색 API
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 알라딘 검색 URL
    const searchUrl = `https://www.aladin.co.kr/shop/wsearch.aspx?SearchWord=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const books = [];

    // 알라딘 검색 결과 파싱 (여러 셀렉터 시도)
    const selectors = [
      '.ss_book_box',
      '.ss_book_list',
      '.Ere_ss_book_box',
      '.Ere_ss_book_list'
    ];

    let foundSelector = null;
    for (const selector of selectors) {
      if ($(selector).length > 0) {
        foundSelector = selector;
        break;
      }
    }

    if (!foundSelector) {
      // 대체 방법: 일반적인 책 정보 패턴 찾기
      $('div[class*="book"], div[class*="ss_"]').each((index, element) => {
        if (books.length >= 10) return false;
        
        const $el = $(element);
        const titleEl = $el.find('a[href*="ItemId"], .bo3, [class*="title"]').first();
        const title = titleEl.text().trim();
        const link = titleEl.attr('href');
        
        if (title && link && link.includes('ItemId')) {
          const coverImgEl = $el.find('img[src*="cover"], .i_cover img, img[alt*="표지"]').first();
          const coverImg = coverImgEl.attr('src') || coverImgEl.attr('data-original') || coverImgEl.attr('data-src');
          
          const authorText = $el.text();
          const authorMatch = authorText.match(/저자[:\s]*([^|/\n]+)/i);
          const author = authorMatch ? authorMatch[1].trim() : '정보 없음';
          
          const itemId = link.match(/ItemId=(\d+)/)?.[1];
          
          if (coverImg) {
            books.push({
              title,
              author,
              coverImg: coverImg.startsWith('http') ? coverImg : `https://www.aladin.co.kr${coverImg}`,
              link: link.startsWith('http') ? link : `https://www.aladin.co.kr${link}`,
              itemId
            });
          }
        }
      });
    } else {
      // 표준 셀렉터 사용
      $(foundSelector).each((index, element) => {
        if (books.length >= 10) return false;

        const $el = $(element);
        const titleEl = $el.find('.bo3, a[href*="ItemId"]').first();
        const title = titleEl.text().trim();
        const link = titleEl.attr('href');
        
        const coverImgEl = $el.find('.i_cover img, img[src*="cover"]').first();
        const coverImg = coverImgEl.attr('src') || coverImgEl.attr('data-original') || coverImgEl.attr('data-src');
        
        // 저자 정보 추출
        let author = '정보 없음';
        const authorEl = $el.find('.ss_book_list li, [class*="author"]').first();
        if (authorEl.length > 0) {
          const authorText = authorEl.text().trim();
          const authorMatch = authorText.match(/저자[:\s]*([^|/\n]+)/i);
          author = authorMatch ? authorMatch[1].trim() : authorText.replace(/^.*?저자\s*:\s*/i, '').split('|')[0].trim();
        }
        
        const itemId = link ? link.match(/ItemId=(\d+)/)?.[1] : null;

        if (title && coverImg) {
          books.push({
            title,
            author: author || '정보 없음',
            coverImg: coverImg.startsWith('http') ? coverImg : `https://www.aladin.co.kr${coverImg}`,
            link: link ? (link.startsWith('http') ? link : `https://www.aladin.co.kr${link}`) : null,
            itemId
          });
        }
      });
    }

    res.json({ books });
  } catch (error) {
    console.error('검색 오류:', error);
    res.status(500).json({ error: '책 검색 중 오류가 발생했습니다.' });
  }
});

// Notion 데이터베이스에 책 정보 저장
app.post('/api/save-to-notion', async (req, res) => {
  try {
    const { title, author, coverImg, link, itemId } = req.body;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return res.status(400).json({ error: 'Notion 데이터베이스 ID가 설정되지 않았습니다.' });
    }

    if (!title || !coverImg) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    // Notion 데이터베이스에 페이지 생성
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        '제목': {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        '지은이': {
          rich_text: [
            {
              text: {
                content: author || '정보 없음',
              },
            },
          ],
        },
        '표지': {
          files: [
            {
              name: 'book-cover.jpg',
              external: {
                url: coverImg,
              },
            },
          ],
        },
        ...(link && {
          '링크': {
            url: link,
          },
        }),
      },
    });

    res.json({ 
      success: true, 
      message: '책 정보가 Notion에 저장되었습니다.',
      pageId: response.id 
    });
  } catch (error) {
    console.error('Notion 저장 오류:', error);
    res.status(500).json({ 
      error: 'Notion에 저장하는 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`위젯 URL: http://localhost:${PORT}/widget.html`);
});
