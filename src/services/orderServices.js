const {db} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");
const {createOrderFromData} = require("../factories/orderFactory");
const {createOrder, getOrders, findOrderByCode, updateOrderData} = require("../repositories/orderRepository");

/**
 * Generate a new order.
 *
 * This function handles the generation of an order based on the data provided in the request body.
 * It validates the order data and generates a unique order code before inserting the order into the database.
 * If the order is successfully inserted, it returns a success message along with the assigned order details.
 * If the order data is invalid or insertion fails, it returns an error message.
 *
 * @param {Object} req - The request object containing the order data in the body.
 * @param {Object} res - The response object used to send the result of the assignment process.
 * @returns {Object} The HTTP response with the order created.
 */
const generateOrder = asyncHandler(async(req, res) => {
    const order = createOrderFromData(req.body)
    if( !order.date || !order.status || !order.productList){
        return res.status(401).json({ message: 'Invalid order data' })
    }

    order.codOrder = await generateUniqueOrderCode()
    const resultInsert = await createOrder(order)
    if(resultInsert){
        res.status(200).json({ message: 'Order generation successful', order: order})
    }else{
        return res.status(401).json({ message: 'Invalid order data' })
    }
})

/**
 * Retrieves all orders.
 *
 * This function handles the retrieval of all orders from the database.
 * It calls the getOrders function to fetch the order data.
 * If the retrieval is successful, it returns the order data with HTTP status code 200 (OK).
 * If the retrieval fails (e.g., invalid order data), it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the order data or an error message in JSON format.
 */
const getAll = asyncHandler(async(req, res) => {
    const result = await getOrders()
    if(result){
        res.status(200).json(result)
    } else {
        res.status(401).json({message: 'Invalid order data'})
    }
})

/**
 * Retrieves order by code.
 *
 * This function handles the retrieval of order based on the provided code.
 * It extracts the order code from the request parameters.
 * If the order code is provided, it calls the findOrderByCode function to search for the order in the database.
 * If the order is found, it returns the order data with HTTP status code 200 (OK).
 * If the order is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the order code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the order data or an error message in JSON format.
 */
const getOrderByCode = asyncHandler(async (req, res) => {
    const orderCode = req.params.codOrder
    if(orderCode){
        const order = await findOrderByCode(orderCode)
        if(order){
            res.status(200).json(order)
        } else{
            res.status(401).json({message: 'Order not found'})
        }
    }else{
        res.status(401).json({message:'Invalid order data'})
    }
})

/**
 * Updates order data by code.
 *
 * This function updates the order data based on the provided order code.
 * It extracts the order code from the request parameters.
 * If the order code is provided, it retrieves the order data using findOrderByCode function.
 * If the order is found, it updates the order data in the database and returns the updated order data with HTTP status code 200 (OK).
 * If the order is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the order code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing order data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the updated order data or an error message in JSON format.
 */
const updateOrderByCode = asyncHandler(async (req, res) => {
    const codOrder = req.params.codOrder
    if(codOrder){
        const order = await findOrderByCode(codOrder)
        if(order){
            const filter = { _codOrder: codOrder }
            const update = { $set: req.body}
            const updatedOrder = await updateOrderData(filter, update)
            res.status(200).json(updatedOrder)
        } else{
            res.status(401).json({message: 'Order not found'})
        }
    }else{
        res.status(401).json({message:'Invalid order data'})
    }
})

/**
 * Generates a unique order code.
 *
 * This function generates a unique order code by counting the total number of documents across all collections in the database.
 * It connects to the appropriate database based on the environment (either test or production).
 * It then counts the total number of documents in each collection and calculates the next available order code.
 * The generated order code is padded with leading zeros to ensure it has a fixed length of 6 characters.
 *
 * @returns {string} The generated unique order code.
 */
const generateUniqueOrderCode = asyncHandler (async () => {
    const collections = await db.instance.listCollections().toArray()
    let totalDocuments = 0
    for (const collectionInfo of collections){
        const collectionData = db.instance.collection(collectionInfo.name)
        const count = await collectionData.countDocuments()
        totalDocuments += count
    }

    const nextCode = totalDocuments + 1
    return nextCode.toString().padStart(6, '0')
})

module.exports = {
    generateOrder,
    getAll,
    getOrderByCode,
    updateOrderByCode
}