const {Model} = require('./model');
const puppeteer = require("puppeteer");
const {LeBonCoinScrapper} = require('./leBonCoinScrapper');

/**
 *
 * @type {LeBonCoinScrapper}
 */
let portal = null;
/**
 *
 * @type {Browser}
 */
let browser = null;
beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    portal = new LeBonCoinScrapper(browser);
}, 60000);

afterAll(async () => {
    return portal.close()
});

describe("testing page loading", () => {
    test("can get total", async () => {
        await portal.load();
        const total = portal.total;
        expect(total).toEqual(expect.any(Number));
        expect(total).toBeGreaterThan(0)
    }, 30000);

    test("can scrap a page", async () => {
        const page = await browser.newPage();
        await page.setViewport({width: 1366, height: 768});
        await page.goto("https://www.leboncoin.fr/voitures/1582418174.htm/", {waitUntil: 'networkidle2'});
        const data = await LeBonCoinScrapper.toModel(page);
        console.log(data);
        expect(data).toEqual(expect.any(Model));
        page.close()
    }, 60000)
});
