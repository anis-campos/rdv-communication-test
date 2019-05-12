const mongoose = require('mongoose');
const {Annonce} = require('./annonces');


const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
/**
 *
 * @return {Promise}
 */
const connect = function () {
    return mongoose.connect(`mongodb+srv://${username}:${password}@cluster0-osk6w.mongodb.net/test?retryWrites=true`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
};


module.exports = {
    models: {Annonce},
    connect
};

