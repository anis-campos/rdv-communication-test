const baseUrl = "https://www.leboncoin.fr/recherche/";


class LeBonCoinScrapper {

    /**
     * 'private' constructor
     * @param {Browser} browser to use
     * @private
     */
    constructor(browser) {
        this._browser = browser;
    }



    async load() {
        const query = 'category=2&text=tesla&search_in=subject';
        const url = `${baseUrl}?${query}`;
        const page = await this._browser.newPage();
        await page.setViewport({width: 1366, height: 768});
        await page.goto(url, {waitUntil: 'networkidle2'});

        this._page = page
    }

    async getTotal() {
        return await this._page.evaluate(el => el.innerHTML, await this._page.$("span._2ilNG")).then(str => parseInt(str));
    }



    /**
     * Close the browser
     * @returns {Promise<void>}
     */
    async close() {
        await this._page.close()
    }


}

exports.LeBonCoinScrapper = LeBonCoinScrapper;
