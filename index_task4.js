const puppeteer = require('puppeteer');

async function monitorButtonClick() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.makemytrip.com/');
    await page.evaluate(() => {
        const observer = new MutationObserver(mutations => {
            //console.log("mutations ", mutations);
            mutations.forEach(mutation => {
                console.log("mutation ", mutation, "mutation.addedNodes.length ", mutation.addedNodes.length);
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName == 'DIV') {
                            handleSelect();
                        }
                    });
                }
                else if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    if (mutation.target.nodeName == 'DIV') {
                        handlePopUpButton();
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.observer = observer;
    });

    await page.exposeFunction('handleButtonClick', () => {
        console.log('Hello Button is Clicked!');
    });
    await page.exposeFunction('handlePopUpButton', () => {
        console.log("Pop-up has been closed");
    });
    await page.exposeFunction('handleSelect', async () => {
        const cityNames = await page.evaluate(() => {
            const cityNodes = document.querySelectorAll('.font14.appendBottom5.blackText');
            const cities = Array.from(cityNodes).map(node => node.textContent.trim());
            return cities;
        });
        console.log('City Names:', cityNames);
    });
    //await browser.close();
}

monitorButtonClick();
