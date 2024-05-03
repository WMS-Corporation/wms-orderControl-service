
const asyncHandler = require("express-async-handler");
const {createOrderFromData} = require("../factories/orderFactory");
const {createOrder, getOrders, findOrderByCode, updateOrderData, generateUniqueOrderCode} = require("../repositories/orderRepository");

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
    let order
    if(verifyBodyFields(req.body, "Create")){
        order = createOrderFromData(req.body)
    } else {
        return res.status(401).json({ message: 'Invalid request body. Please ensure all required fields are included and in the correct format.' })
    }

    if( !order.date || !order.status || !order.productList){
        return res.status(401).json({ message: 'Invalid order data' })
    }

    for(let product of order.productList){
        if(!product._codProduct || !product._quantity){
            return res.status(401).json({ message: 'Invalid product data' })
        }
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

    if(!verifyBodyFields(req.body, "Update")){
        return res.status(401).json({message: 'Invalid request body. Please ensure all required fields are included and in the correct format.'})
    }

    if(codOrder){
        const order = await findOrderByCode(codOrder)
        if(order){
            const updateData = handleUpdateData(req.body, order)
            if(!updateData){
                return res.status(401).json({message: 'The products specified in the request body does not exist in the order\'s product list.'})
            }
            const filter = { _codOrder: codOrder }
            const updatedOrder = await updateOrderData(filter, updateData)
            res.status(200).json(updatedOrder)
        } else{
            res.status(401).json({message: 'Order not found'})
        }
    }else{
        res.status(401).json({message:'Invalid order data'})
    }
})

/**
 * Function to handle updating order data based on the provided body and existing order.
 *
 * This function takes the update data from the request body and the existing order data.
 * If product list is provided, it iterates through the products in the update data and updates the corresponding products in the existing order.
 * If a product to be updated does not exist in the existing order, it adds the new product to the order.
 * The updated order data, including the modified product list, is returned.
 * If no product list is provided in the update data, the entire body is treated as the update, excluding the product list.
 *
 * @param {Object} body - The body containing the update data.
 * @param {Object} order - The existing order data.
 * @return {Object|null} - The update object or null if any product to be updated does not exist.
 **/
const handleUpdateData = (body, order) => {
    if (body._productList) {
        const productListToUpdate  = body._productList
        const orderProductMap = new Map(order._productList.map((product) => [product._codProduct, product]))

        const update = { $set: {} };
        Object.keys(body).forEach(key => {
            if (key !== '_productList') {
                update.$set[key] = body[key];
            }
        });

        productListToUpdate.forEach(productToUpdate => {
            let product = orderProductMap.get(productToUpdate._codProduct)
            if(product){
                Object.keys(productToUpdate).forEach(field => {
                    product[field] = productToUpdate[field]
                });
            } else {
                orderProductMap.set(productToUpdate._codProduct, productToUpdate)
            }
        })
        update.$set["_productList"] = Array.from(orderProductMap.values())
        return update;
    } else {
        return { $set: body }
    }
}

/**
 * Function to verify the fields in the request body based on the operation type.
 *
 * This function checks whether the fields in the request body are valid for the specified operation type,
 * such as "Create" or "Update".
 * It validates the presence and correctness of required fields depending on the operation.
 * Returns true if all fields are valid; otherwise, returns false.
 *
 * @param {Object} body - The request body to be verified.
 * @param {string} operation - The type of operation (e.g., "Create" or "Update").
 * @return {boolean} - Indicates whether the fields in the body are valid for the specified operation.
 **/

const verifyBodyFields = (body, operation) => {
    const orderValidFields = [
        "_date",
        "_status",
        "_productList",
    ];

    const productValidFields = [
        "_codProduct",
        "_quantity"
    ];

    const validateFields = (fields, body, requireAll) => {
        const presentFields = Object.keys(body);
        const missingFields = fields.filter(field => !presentFields.includes(field));

        if (requireAll) {
            return missingFields.length === 0 && presentFields.length === fields.length;
        } else {
            if(presentFields.length === 1 && presentFields[0] === "_codProduct")
                return false
            else
                return presentFields.every(field => fields.includes(field));
        }
    };

    if (operation === "Create") {
        return validateFields(orderValidFields, body, true) &&
            body._productList.every(product => validateFields(productValidFields,  product, true ));
    } else {
        return validateFields(orderValidFields, body) &&
            (!body._productList || body._productList.every(product => (validateFields(productValidFields, product)) && product._codProduct));
    }
}

module.exports = {
    generateOrder,
    getAll,
    getOrderByCode,
    updateOrderByCode
}