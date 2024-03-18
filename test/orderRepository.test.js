const {Order} = require("../src/entities/order")
const path = require("path")
const fs = require("fs")
const {createOrder, getOrders, findOrderByCode, updateOrderData} = require("../src/repositories/orderRepository");
const {connectDB, collections, closeDB} = require("../src/config/dbConnection");

describe('orderRepository testing', () => {
    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_REPOSITORY);
    });

    beforeEach(async() => {
        await collections.orders.deleteMany()
        const jsonFilePath = path.resolve(__dirname, './Resources/MongoDB/WMS.Order.json');
        const orderData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        await collections.orders.insertOne(orderData)
    })
    afterAll(async () => {
        await closeDB()
    });

    it("should create a new task", async ()  => {
        let productCodeList = [ "00020", "00024"]
        const result = await createOrder(new Order("24/03/2024", "pending", productCodeList, "000868"))
        expect(result).toBeDefined()
    })

    it('should return all the orders', async() => {
        const result = await getOrders()
        const numDoc = await collections.orders.countDocuments()
        expect(result.length).toEqual(numDoc)
    })

    it('should find an order by code', async () => {
        const order = await findOrderByCode("000549")
        expect(order._status).toEqual("pending")
        expect(order._date).toEqual("20/03/2023")
    });

    it('should return null if order is not found', async () => {
        const codOrder = '000123'
        const order = await findOrderByCode(codOrder)

        expect(order).toBeNull()
    });

    it('should return an updated order with new status', async() => {
        const filter = { _codOrder: "000549" }
        const update = { $set: { _status: "Completed" } }

        const updatedOrder = await updateOrderData(filter, update)
        expect(updatedOrder._status).toEqual("Completed")
    })

    it('should return null if the filter is not correct', async() => {
        const filter = { _codOrder: "" }
        const update = { $set: { _status: "Completed" } }

        const updatedOrder = await updateOrderData(filter, update)
        expect(updatedOrder).toBeNull()
    })
});