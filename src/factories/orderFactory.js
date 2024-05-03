const {Order} = require ('../entities/order')
/**
 * Creates an order object using order data.
 *
 * This function generates an order object based on the provided order data.
 *
 * @param {Object} orderData - The order data used to create the order object.
 * @returns {Order} The newly created Order object.
 */
function createOrderFromData(orderData) {
    return new Order(orderData._date, orderData._status, orderData._productList, orderData._codOrder);
}

module.exports = {createOrderFromData}