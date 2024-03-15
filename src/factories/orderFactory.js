const {Order} = require ('../entities/order')
/**
 * Creates an order object from order data.
 *
 * This function creates an order object from the provided order data.
 *
 * @param {Object} orderData - The order data to create the order object from.
 * @returns {Order} The created Order object.
 */
function createOrderFromData(orderData) {
    return new Order(orderData._date, orderData._status, orderData._productList, orderData._codOrder);
}

module.exports = {createOrderFromData}