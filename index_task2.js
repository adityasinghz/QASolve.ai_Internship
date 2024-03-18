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

function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}


async function cancelAdAndSearch() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('E:\\Programming\\Node js\\Practice\\backend\\index_task2.html');
    await page.waitForSelector('#first_name');
    await page.waitForSelector('#last_name');
    await page.waitForSelector('#funRun5k');
    await page.waitForSelector('#email');
    await page.waitForSelector('#password');
    await page.waitForSelector('#division');

    await page.type('#first_name', 'Aditya');
    delay(10000);
    await page.type('#last_name', 'Singh');
    delay(10000);
    await page.click('#funRun5k');
    delay(10000);
    await page.type('#email', 'adityasinghz@yaml.com');
    delay(10000);
    await page.type('#password', 'password123');
    delay(10000);
    await page.select('#division', 'elder');
    delay(10000);

    await page.evaluate(() => {
        document.querySelector('button[type=submit]').click();
    });

    await page.waitForNavigation();

    await browser.close();
}





cancelAdAndSearch();

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
