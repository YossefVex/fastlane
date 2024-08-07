const axios = require('axios');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const url = 'https://fastlane.co.il';
const csvFilePath = 'prices.csv';

// Function to fetch the price and write to CSV
const fetchPriceAndWriteToCSV = async () => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const priceText = $('#lblPrice').text();
    const currentDateTime = new Date().toISOString();

    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'price', title: 'Price' },
        { id: 'date', title: 'Date' }
      ],
      append: true
    });

    const record = [{ price: priceText, date: currentDateTime }];

    // Check if the file exists, if not, create it with headers
    if (!fs.existsSync(csvFilePath)) {
      await csvWriter.writeRecords([]);
    }

    await csvWriter.writeRecords(record);
    console.log('Record added:', record);
  } catch (error) {
    console.error('Error fetching the webpage:', error);
  }
};

// Schedule the task to run every 5 minutes
schedule.scheduleJob('*/5 * * * *', fetchPriceAndWriteToCSV);

// Initial run
fetchPriceAndWriteToCSV();
