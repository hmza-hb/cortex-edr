import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('BROWSER CONSOLE ERROR:', msg.text());
            }
            else {
                // console.log('BROWSER CONSOLE:', msg.text());
            }
        });

        page.on('pageerror', error => {
            console.log('BROWSER PAGE ERROR:', error.message);
        });

        page.on('requestfailed', request => {
            console.log('BROWSER REQUEST FAILED:', request.url(), request.failure()?.errorText);
        });

        await page.goto('http://localhost:3000/chat', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch (e) {
        console.error("Puppeteer Script Error:", e);
    }
})();
