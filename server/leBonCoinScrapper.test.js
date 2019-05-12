const {models, connect} = require('./models');
const puppeteer = require("puppeteer");
const {LeBonCoinScrapper} = require('./leBonCoinScrapper');
/**
 *
 * @type {Browser}
 */
let browser = null;

beforeAll(async () => {
    await connect();
    browser = await puppeteer.launch({headless: false});
}, 60000);


afterAll(() => browser && browser.close());


test("can scrap a page and create model", async () => {
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.goto("https://www.leboncoin.fr/voitures/1582418174.htm/", {waitUntil: 'networkidle2'});
    const data = await LeBonCoinScrapper.toModel(page);
    console.log(data);
    expect(data).toEqual(expect.any(models.Annonce));
    page.close()
}, 60000);


describe("Can scrape tesla search", () => {
    /**
     *
     * @type {LeBonCoinScrapper}
     */
    let leBonCoinScrapper = null;

    beforeAll(async () => leBonCoinScrapper = new LeBonCoinScrapper(browser), 60000);

    afterAll(() => leBonCoinScrapper.close());

    test("can get total", async () => {
        await leBonCoinScrapper.load();
        const total = leBonCoinScrapper.total;
        expect(total).toEqual(expect.any(Number));
        expect(total).toBeGreaterThan(0)
    }, 30000);

    test("can scrap a certain number of page & elements", async () => {
        const numberOfPages = 1;
        const numberOfElements = 4;
        const data = await leBonCoinScrapper.scrap(numberOfPages, numberOfElements);
        console.log(data);
        expect(data).toBeTruthy();
        expect(data).toEqual(expect.any(Array));
        expect(data.length).toBe(numberOfPages * numberOfElements)
    }, 1800000);

});

