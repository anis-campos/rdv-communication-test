const {LeBonCoinScrapper} = require("../leBonCoinScrapper");
const {Router} = require('express');
const bodyParser = require('body-parser');

const router = Router();
const jsonParser = bodyParser.json();

router.post('/annonces', jsonParser, async (req, res) => {
    let browser;
    try {
        browser = await req.context.puppeteer.launch({headless: false});
        const {
            startingPage = 1,
            numberOfPage = 1,
            numberOfElements = 10
        } = req.body;
        const leBonCoinScrapper = new LeBonCoinScrapper(browser);
        await leBonCoinScrapper.load(startingPage);
        const data = await leBonCoinScrapper.scrap(numberOfPage, numberOfElements);
        return res.send({number: data.length});
    } catch (e) {
        next(e)
    }
    browser.close();

});

router.get('/annonces', async (req, res) => {
    const users = await req.context.models.Annonce.find();
    return res.send(users);
});

router.get('/annonces/:id', async (req, res) => {
    const user = await req.context.models.Annonce.findById(
        req.params.id,
    );
    return res.send(user);
});

module.exports = router;
