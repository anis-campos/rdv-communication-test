puppeteer = require("puppeteer");
const {LeBonCoinScrapper} = require('./leBonCoinScrapper');

/**
 *
 * @type {LeBonCoinScrapper}
 */
let portal = null;

beforeAll(async () => {
    const browser = await puppeteer.launch({headless: false});

    portal = new LeBonCoinScrapper(browser);
    return portal.load();
}, 30000);

afterAll(async () => {
    //return portal.close()
});

describe("testing page loading", () => {
    test("can get total", async () => {
        const total = await portal.getTotal()
        expect(total).toEqual(expect.any(Number))
        expect(total).toBeGreaterThan(0)
    }, 10000)
});
