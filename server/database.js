const mongoose = require('mongoose');

const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
/**
 *
 * @return {Promise}
 */
exports.connect = function () {
    return mongoose.connect(`mongodb+srv://${username}:${password}@cluster0-osk6w.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true})
};

exports.mongoose = mongoose;
