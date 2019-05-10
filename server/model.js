exports.Model = class Model {

    /**
     *
     * @param {Array<String>}images
     * @param {String}title
     * @param {String}price
     * @param {String}date
     * @param {Array<{id:String,name:String,value:String}>}criteria
     * @param {String}seller
     * @param {String}phone
     */
    constructor({
                    images,
                    title,
                    price,
                    date,
                    criteria,
                    seller,
                    phone,

                }) {
        this._images = images;
        this._title = title;
        this._price = price;
        this._date = date;
        this._criteria = criteria;
        this._seller = seller;
        this._phone = phone;

    }

};
