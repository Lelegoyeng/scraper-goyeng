const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

(async () => {
    const url = "https://www.tokopedia.com/search?st=product&q=laptop";
    const randomAgent = randomUseragent.getRandom();
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const context = await browser.createIncognitoBrowserContext();//mode penyamaran
    const page = await context.newPage();//membuat tab baru
    await page.setJavaScriptEnabled(true);//aktifkan javascript
    await page.setUserAgent(randomAgent);//setting user agent
    await page.goto(url, { waituntil: 'domcontentloaded', timeout: 0 });//tunggu proses dom/load pagenya selesai
    //await page.screenshot({ path: 'screenshot.png' })
    //mendapatkan isi tag html body
    const body = await page.evaluate(() => {
        return document.querySelector('body').innerHTML;
    });

    //console.log(body);

    const $ = cheerio.load(body);
    const listItems = $('[data-testid="master-product-card"]');
 
    var resulst = [];
    listItems.each(function (idx, el) {
        var nama = $('[data-testid="spnSRPProdName"]', el).text();
        var harga = $('[data-testid="spnSRPProdPrice"]', el).text();
        var link = $('a[href]', el).attr("href");
        if (harga != null && harga != "") {
            resulst.push({
                "nama": nama,
                "harga": harga,
                "link": link
            });
        }
 
    });
 
    console.log(resulst);

    // await page.screenshot({path: 'ss.png'})
    await browser.close();//close browser puppeteer jika sudah selesai
})();