const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/mmt', async (req, res) => {
    try {
        res.send(await cancelAdAndSearch());
    } catch (error) {
        console.error('Error fetching function:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function cancelAdAndSearch() {

    //Wait for the iframe to load



    const browser = await puppeteer.launch({ headless: false }); // Headless:false to see the action in the browser
    const page = await browser.newPage();
    await page.goto('https://www.makemytrip.com/', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
        return new Promise(resolve => {
            setTimeout(resolve, 10000);
        });
    });
    //Test
    //Test

    await page.click('#fromCity');

    await page.waitForSelector('.react-autosuggest__suggestions-list');

    await page.click('#react-autowhatever-1-section-0-item-0');

    await page.click('#toCity');

    await page.waitForSelector('.react-autosuggest__suggestions-list');

    await page.click('#react-autowhatever-1-section-0-item-1');

    await page.click('#departure');
    await page.waitForSelector('.DayPicker-Month');
    const dateToSelect = 'Sat Mar 16 2024';
    const selector = `.DayPicker-Day[aria-label="${dateToSelect}"]`;

    await page.waitForSelector(selector, { visible: true });

    await page.click(selector);
    await page.waitForSelector("#top-banner > div.minContainer > div > div > div > div.fsw > p > a");
    await page.click("#top-banner > div.minContainer > div > div > div > div.fsw > p > a");
}

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


// Wait for the iframe to load
// const iframeSelector = "#webklipper-publisher-widget-container-notification-frame";
// await page.waitForSelector(iframeSelector);
// const iframe = await page.$('iframe');
// const iframeElement = await iframe.$('webklipper-publisher-widget-container-notification-frame');

// if (iframeElement) {
//     const iframeContent = await iframeElement.contentFrame();
//     const closeButtonSelector = 'webklipper-publisher-widget-container-notification-close-div';
//     await iframeContent.waitForSelector(closeButtonSelector);
//     if (await iframeContent.$(closeButtonSelector)) {
//         await iframeContent.click(closeButtonSelector);
//     }
// }