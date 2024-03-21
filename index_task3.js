const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;



async function toastDebug() {
    const browser = await puppeteer.launch({ devtools: true });
    const page = await browser.newPage(); // Create a new page
    await page.goto('http://localhost:3000'); // Replace with your React app URL
    await page.waitForSelector('#root > div > button');
    await page.click('#root > div > button');
    await page.evaluate(() => {
        setTimeout(() => {
            debugger; // This will trigger the debugger after 3 seconds
        }, 4000);
    });
}


async function networkInter() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.setViewport({ width: 1200, height: 800 })

    await page.setRequestInterception(true)

    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort()
        else request.continue()
    })

    await page.goto('https://www.udemy.com/')
    await page.screenshot({ path: 'screenshot.png' })

    await browser.close()

}

async function eventL() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', consoleObj => console.log(consoleObj.text()));

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });

    page.on('request', request => console.log('Request: ', request.url()));

    page.on('response', response => console.log('Response: ', response.url()));

    await page.goto('https://www.udemy.com/');

    await browser.close();
}

app.get('/toast', async (req, res) => {
    try {
        await toastDebug(); // Execute toastDebug function when /toast endpoint is accessed
        res.send("DevTools opened");
    } catch (error) {
        console.error('Error fetching function:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/inter', async (req, res) => {
    try {
        await networkInter(); // Execute toastDebug function when /toast endpoint is accessed
        res.send("DevTools opened");
    } catch (error) {
        console.error('Error fetching function:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/eventL', async (req, res) => {
    try {
        await eventL(); // Execute toastDebug function when /toast endpoint is accessed
        res.send("Event L");
    } catch (error) {
        console.error('Error fetching function:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
