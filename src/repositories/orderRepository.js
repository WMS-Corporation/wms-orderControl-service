const {collections} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");

/**
 * Creates a new order.
 *
 * This function inserts a new order into the database.
 *
 * @param {Object} order - The order object to create.
 * @returns {Object} The result of the order creation operation.
 * @throws {Error} If failed to create order.
 */
const createOrder = asyncHandler(async (order) => {
    return await collections?.orders?.insertOne(order)
});

/**
 * Retrieves all orders.
 *
 * This function handles the retrieval of all orders from the database.
 *
 * @returns {Array|null} An array containing order data if retrieval is successful, otherwise null.
 */
const getOrders = asyncHandler(async () => {
    return await collections?.orders?.find().toArray()
})

/**
 * Finds an order by code.
 *
 * This function queries the database to find an order based on the provided code.
 *
 * @param {string} codOrder - The code of the order to find.
 * @returns {Object|null} The task object if found, or null if not found.
 */
const findOrderByCode = asyncHandler(async (codOrder) => {
    return await collections?.orders?.findOne({ _codOrder: codOrder })
});

module.exports = {
    createOrder,
    getOrders,
    findOrderByCode
}