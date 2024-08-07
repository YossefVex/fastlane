const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://fastlane.co.il';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const priceText = $('#lblPrice').text();
    console.log('Price:', priceText);
  })
  .catch(error => {
    console.error('Error fetching the webpage:', error);
  });
