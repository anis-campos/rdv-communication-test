const {Model} = require('./model');
const baseUrl = "https://www.leboncoin.fr/recherche/";

const pageSize = 35;

class LeBonCoinScrapper {

    /**
     * 'private' constructor
     * @param {Browser} browser to use
     * @private
     */
    constructor(browser) {
        this._browser = browser;
        this._currentPage = 1;
        this.total = 0;
        this.numberOfPages = 0;
        this._page = null;
        this._firstLoad = true
    }


    async load(pageNumber = this._currentPage) {
        this._currentPage = pageNumber;
        const query = `category=2&text=tesla&search_in=subject&page=${this._currentPage}`;
        const url = `${baseUrl}?${query}`;
        if (this._firstLoad) {
            this._page = await this._browser.newPage();
            await this._page.setViewport({width: 1366, height: 768});
        }

        await this._page.goto(url, {waitUntil: 'networkidle2'});

        if (this._firstLoad) {
            this._firstLoad = false;
            this.total = await this._page.evaluate(el => el.innerHTML, await this._page.$("span._2ilNG")).then(str => parseInt(str));
            this.numberOfPages = Math.ceil(this.total / pageSize);
        }

    }


    async nextPage() {
        if (this._currentPage >= this.numberOfPages) return false;
        this._currentPage = (this._currentPage + 1) % (this.numberOfPages + 1);
        await this.load(this._currentPage);
        return true;
    }


    async scrap() {


        let listItems = [];
        for (let i = this._currentPage; i <= this.numberOfPages; i++) {
            if (this._firstLoad)
                await this.load();

            const array = await this._page.evaluate(() => Array.from(document.querySelectorAll('a.clearfix.trackable')).map(el => ({
                title: el.title,
                href: el.href
            })));
            listItems = listItems.concat(array);

            this._currentPage += 1000;
            await this.nextPage()
        }

        const promises = [];
        for (const listItem of listItems.slice(0, 10)) {
            const p = new Promise(async (resolve) => {
                try {
                    const page = await this._browser.newPage();
                    await page.goto(listItem.href, {waitUntil: 'networkidle2'});
                    const model = await LeBonCoinScrapper.toModel(page);
                    page.close();
                    resolve(model)
                } catch (e) {
                    resolve({error: e})
                }
            });
            promises.push(p)
        }


        return await Promise.all(promises);
    }

    /**
     * Close the browser
     * @returns {Promise<void>}
     */
    async close() {
        if (this._page) {
            await this._page.close();
            this._page = null
        }
    }


    /**
     *
     * @param {Page} page
     * @return {Promise<Model>}
     */
    static async toModel(page) {

        let phone = null;
        const button = await page.$("[data-qa-id=adview_contact_container] button[data-qa-id=adview_button_phone_contact]");
        if (button) {
            await button.click();
            await page.waitForSelector('a._2sNbI', {visible: true});
            phone = await page.$eval('a._2sNbI', el => el.textContent);
        }

        const criteria = await page.$$eval('[data-qa-id=criteria_container]>div', els =>
            els.map(div => {
                const id = div.getAttribute("data-qa-id");
                const name = div.childNodes[0].children[0].innerHTML;
                const value = div.childNodes[0].children[1].innerHTML;
                return {id, name, value}
            }));

        const nextButton = await page.$('[data-qa-id=slideshow_control_next]');
        if (nextButton) {
            await nextButton.click()
        }

        const images = await page.$$eval('._2x8BQ img', els => els.map(el => el.getAttribute('src')));
        const seller = await page.$eval('._2rGU1', el => el.textContent);
        const date = await page.$eval('[data-qa-id=adview_date]', el => el.textContent);
        const price = await page.$eval('[data-qa-id=adview_price] div span', el => el.textContent);
        const title = await page.$eval('[data-qa-id=adview_title] h1', el => el.textContent);

        return new Model({
            images: images,
            title: title,
            price: price,
            date: date,
            criteria: criteria,
            seller: seller,
            phone: phone

        })
    }
}

exports.LeBonCoinScrapper = LeBonCoinScrapper;
