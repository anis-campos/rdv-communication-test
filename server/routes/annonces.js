const {LeBonCoinScrapper} = require("../leBonCoinScrapper");
const {Router} = require('express');

const router = Router();

router.post('/', async (req, res) => {

    const browser = await req.context.puppeteer.launch({headless: false});
    const leBonCoinScrapper = new LeBonCoinScrapper(browser);
    await leBonCoinScrapper.load();
    const data = await leBonCoinScrapper.scrap(1, 10);
    browser.close()
    return res.send({number: data.length});
});

router.get('/', async (req, res) => {
    const users = await req.context.models.Annonce.find();
    return res.send(users);
});

router.get('/:userId', async (req, res) => {
    const user = await req.context.models.Annonce.findById(
        req.params.userId,
    );
    return res.send(user);
});

module.exports = router;
