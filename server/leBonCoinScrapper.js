const {models} = require('./models');
const PromisePool = require('es6-promise-pool');

const baseUrl = "https://www.leboncoin.fr/recherche/";

const pageSize = 35;


function chunk(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}

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
            this._page = (await this._browser.pages())[0];
            await this._page.setViewport({width: 1366, height: 768});
        }

        await this._page.goto(url, {waitUntil: 'networkidle2'});

        if (this._firstLoad) {
            this._firstLoad = false;
            this.total = await this._page.evaluate(el => el.innerHTML, await this._page.$("span._2ilNG")).then(str => parseInt(str));
            this.numberOfPages = Math.ceil(this.total / pageSize);
        }

    }


    async scrap(numberOfPages = this.numberOfPages, size = pageSize) {

        let lastPageIndex = this._currentPage + numberOfPages;
        lastPageIndex = lastPageIndex > this.numberOfPages ? numberOfPages : lastPageIndex;

        let listItems = [];
        while (this._currentPage <= lastPageIndex) {
            if (this._firstLoad)
                await this.load();

            const promises = (await this._page.$$('a.clearfix.trackable')).splice(0, size).map(el => {

                return new Promise(async resolve => {
                    return resolve({
                        title: await (await el.getProperty('title')).jsonValue(),
                        href: await (await el.getProperty('href')).jsonValue()
                    });
                });
            });

            listItems = listItems.concat(await Promise.all(promises));

            this._currentPage++;
            if (this._currentPage < lastPageIndex)
                await this.load(this._currentPage);
        }

        const pageMap = {};
        const rep = [];
        const concurrency = 8;


        const generatePromises = function* (browser, listItems) {
            for (const {title, href} of listItems)
                yield new Promise(async resolve => {
                    console.log(`opening: ${title}`);
                    const page = await browser.newPage();
                    pageMap[href] = page;
                    await page.setViewport({width: 1366, height: 768});
                    await page.goto(href, {waitUntil: 'networkidle2'});
                    resolve()
                });
        };


        const chunks = chunk(listItems, concurrency);

        for (const chunk of chunks) {
            const pool = new PromisePool(generatePromises(this._browser, chunk), concurrency);
            await pool.start();

            for (const {href} of chunk.reverse()) {
                const page = pageMap[href];
                try {
                    const model = await LeBonCoinScrapper.toModel(page);
                    rep.push(model)
                } catch (e) {
                    rep.push({error: e})
                } finally {
                    if (!page.isClosed())
                        page.close()
                }
            }
        }
        return rep
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
    static
    async toModel(page) {

        const phone_promise = new Promise(async resolve => {
            try {
                const button = await page.$("[data-qa-id=adview_contact_container] button[data-qa-id=adview_button_phone_contact]");
                if (button) {
                    await button.click();
                    await page.waitForSelector('a._2sNbI', {visible: true});
                    const val = await page.$eval('a._2sNbI', el => el.textContent);
                    console.log('phone:', val);
                    resolve(val)

                } else {
                    console.log("No phone");
                    resolve(null)

                }
            } catch (e) {
                console.error("phone error", e);
                resolve(null)
            }
        });

        const criteria_promise = new Promise(async resolve => {
            try {
                const criteria = await page.$$eval('[data-qa-id=criteria_container]>div', els =>
                    els.map(div => {
                        const id = div.getAttribute("data-qa-id");
                        const name = div.childNodes[0].children[0].innerHTML;
                        const value = div.childNodes[0].children[1].innerHTML;
                        return {id, name, value}
                    }));
                console.log('criteria:', criteria);
                resolve(criteria)
            } catch (e) {
                console.error("criteria error", e);
                resolve(null)
            }
        });

        const images_promise = new Promise(async resolve => {
            try {
                const nextButton = await page.$('[data-qa-id=slideshow_control_next]');
                if (nextButton) {
                    await nextButton.click()
                }
                const val = await page.$$eval('._2x8BQ img', els => els.map(el => el.getAttribute('src')));
                console.log('image:', val);
                resolve(val)
            } catch (e) {
                console.error("image error", e);
                resolve(null)
            }
        });

        const seller_promise = new Promise(async resolve => {

            try {
                let name = (await page.$('._2rGU1')) || (await page.$('._2j7r2'));
                const seller = await page.evaluate(el => el.textContent, name);
                console.log('seller:', seller);
                resolve(seller)
            } catch (e) {
                console.error("seller error", e);
                resolve(null)
            }
        });

        const date_promise = new Promise(async (resolve) => {
            try {
                const date = await page.$eval('[data-qa-id=adview_date]', el => el.textContent);
                resolve(date);
                console.log('date:', date);
            } catch (e) {
                console.error("date error", e);
                resolve(null)
            }
        });

        const price_promise = new Promise(async (resolve) => {
            try {
                const price = await page.$eval('[data-qa-id=adview_price] div span', el => el.textContent);
                resolve(price);
                console.log('price:', price);
            } catch (e) {
                console.error("price error", e);
                resolve(null)
            }
        });

        const title_promise = new Promise(async (resolve) => {
            try {
                const title = await page.$eval('[data-qa-id=adview_title] h1', el => el.textContent);
                resolve(title);
                console.log('title:', title);
            } catch (e) {
                console.error("title error", e);
                resolve(null)
            }
        });

        const fields = await Promise.all([
            images_promise,
            title_promise,
            price_promise,
            date_promise,
            criteria_promise,
            seller_promise,
            phone_promise]);

        const annonce = new models.Annonce({
            source: page.target().url(),
            images: fields[0],
            title: fields[1],
            price: fields[2],
            date: fields[3],
            criteria: fields[4],
            seller: fields[5],
            phone: fields[6]
        });

        annonce.save();

        return annonce;
    }
}

module.exports.LeBonCoinScrapper = LeBonCoinScrapper;
