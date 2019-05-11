const {Schema, model} = require('mongoose')


const annoncesSchema = new Schema({
        source: {
            type: String,
            unique: true
        },
        images: [String],
        title: String,
        price: String,
        date: String,
        criteria: [{
            id: String, name: String, value: String
        }],
        seller: String,
        phone: String
    })
;

const Annonce = model('Annonce', annoncesSchema);

module.exports.Annonce = Annonce;
