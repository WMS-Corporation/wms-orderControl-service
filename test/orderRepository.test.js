const {Order} = require("../src/entities/order")
const path = require("path")
const fs = require("fs")
const {createOrder} = require("../src/repositories/orderRepository");
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

    it("should create a new task",async () =>{
        let productList = [
            {
                "_codProduct": "00020",
                "_name": "Loacker",
                "_category": "Snack",
                "_expirationDate": "01-01-2025",
                "_type": "NoRefrigerated"
            },
            {
                "_codProduct": "00024",
                "_name": "Caffe Lavazza",
                "_category": "Caffe",
                "_expirationDate": "03-04-2024",
                "_type": "NoRefrigerated"
            }
        ]
        const result=await createOrder(new Order("24/03/2024","pending",productList,"000868"))
        expect(result).toBeDefined()
    })




});