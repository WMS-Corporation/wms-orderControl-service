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

/**
 * Updates order data based on a filter.
 *
 * This function updates order data based on the provided filter criteria and the update object.
 *
 * @param {Object} filter - The filter criteria to find the order(s) to update.
 * @param {Object} update - The update object containing the fields to update and their new values.
 * @returns {Object|null} The updated order data if the user is found, otherwise null.
 */
const updateOrderData = asyncHandler(async(filter, update) => {
    const options = { returnOriginal: false}
    await collections?.orders?.findOneAndUpdate(filter, update, options)
    return await collections?.orders?.findOne(filter)
})

/**
 * Generates a unique order code.
 *
 * This function generates a unique order code by retrieving the next available code from the counter collection,
 * incrementing the count, and returning the next code as a string padded with zeros to ensure a fixed length of 6 characters.
 *
 * @returns {string} The next unique order code.
 */
const generateUniqueOrderCode = asyncHandler (async () => {
    const nextCode = await collections?.counter?.findOne()
    await collections.counter.updateOne({}, { $inc: {count: 1}})
    return nextCode.count.toString().padStart(6, '0')
})

module.exports = {
    createOrder,
    getOrders,
    findOrderByCode,
    updateOrderData,
    generateUniqueOrderCode
}