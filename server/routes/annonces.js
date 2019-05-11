const {LeBonCoinScrapper} = require("../leBonCoinScrapper");
const {Router} = require('express');

const router = Router();

router.post('/annonces', async (req, res) => {

    const browser = await req.context.puppeteer.launch({headless: false});
    const leBonCoinScrapper = new LeBonCoinScrapper(browser);
    await leBonCoinScrapper.load();
    const data = await leBonCoinScrapper.scrap(1, 10);
    browser.close()
    return res.send({number: data.length});
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
