const express = require('express');
const {models, connect} = require('./models');
const routes = require('./routes');
const puppeteer = require("puppeteer");

const app = express();
const port = process.env.PORT || 5000;



app.use(async (req, res, next) => {
    req.context = {
        models,
        puppeteer
    };
    next();
});

app.use('/api',routes.annonce);

const eraseDatabaseOnSync = false;


connect().then(async () => {

    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.Annonce.deleteMany({}),
        ]);
    }

    app.listen(port, () => console.log(`Listening on port ${port}`));
});

