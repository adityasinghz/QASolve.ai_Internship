const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;







async function toastDebug() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();

    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    client.on('Runtime.consoleAPICalled', event => {
        const { type, args } = event;
        if (type === 'info') {
            const message = args[0].value; // Extract the message text
            console.log('Console message:', message);
        }
    });


    client.on('DOM.attributeModified', event => {
        console.log('DOM attribute modified:', event);
    });

    await page.goto('http://localhost:3000/');

    await browser.close();
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

async function extractEvents() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const client = await page.target().createCDPSession();

    await client.send('Debugger.enable');

    await client.send('DOMDebugger.setEventListenerBreakpoint', {
        eventName: '*'
    });

    await waitFor(5000);
    await client.send('Debugger.resume');
    setTimeout(() => {
        browser.close();
    }, 10000);

}

const waitFor = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


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

app.get('/event-listeners', async (req, res) => {
    try {
        await extractEvents();
        res.send("eventListeners");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
