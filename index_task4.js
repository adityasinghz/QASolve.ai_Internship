const puppeteer = require('puppeteer');

async function monitorButtonClick() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName == 'DIV') {
                            handleButtonClick();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.observer = observer;
    });

    await page.exposeFunction('handleButtonClick', () => {
        console.log('Hello Im Clicked!');
    });
    //await browser.close();
}

monitorButtonClick();
