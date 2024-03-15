const dotenv = require('dotenv')
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../src/config/dbConnection");
const {generateOrder} = require("../src/services/orderServices");

dotenv.config()
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
};
const req = {
    body : "",
    user : "",
    params: ""
}

describe('Order services testing', () => {

    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_SERVICES);
    });

    beforeEach(async() => {
        await collections.orders.deleteMany()
        const jsonFilePath = path.resolve(__dirname, './Resources/MongoDB/WMS.Order.json');
        const orderData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        await collections.orders.insertOne(orderData)
        req.body = ""
        req.user = ""
        req.params = ""
    })

    afterAll(async () => {
        await closeDB()
    });

    it('it should return 401 if the data are invalid', async () => {
        const res=mockResponse()
        req.body = {
            _date: "14/03/2024",
            _status: "",
            _productList: ""
        }

        await generateOrder(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid order data'})
    });

    it('it should return 200 if the order generation is successful', async () => {
        const res=mockResponse()
        req.body = {
            _date: "14/03/2024",
            _status: "pending",
            _productList: [
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
        }

        await generateOrder(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });


});