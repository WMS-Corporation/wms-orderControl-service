class Order {

    constructor(date, status, productList, codOrder) {
        this._date = date
        this._status = status
        this._productList = productList
        this._codOrder = codOrder
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get productList() {
        return this._productList;
    }

    set productList(value) {
        this._productList = value;
    }

    get codOrder() {
        return this._codOrder;
    }

    set codOrder(value) {
        this._codOrder = value;
    }
}

module.exports = {Order}