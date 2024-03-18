class Order {

    constructor(date, status, productCodeList, codOrder) {
        this._date = date
        this._status = status
        this._productCodeList = productCodeList
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

    get productCodeList() {
        return this._productCodeList;
    }

    set productCodeList(value) {
        this._productCodeList = value;
    }

    get codOrder() {
        return this._codOrder;
    }

    set codOrder(value) {
        this._codOrder = value;
    }
}

module.exports = {Order}