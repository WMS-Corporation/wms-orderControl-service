const dotenv = require('dotenv')
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../src/config/dbConnection");
const {generateOrder, getAll, getOrderByCode, updateOrderByCode} = require("../src/services/orderServices");

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
        const res = mockResponse()
        req.body = {
            _date: "14/03/2024",
            _status: "",
            _productCodeList: ""
        }

        await generateOrder(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid order data'})
    });

    it('it should return 200 if the order generation is successful', async () => {
        const res = mockResponse()
        req.body = {
            _date: "14/03/2024",
            _status: "pending",
            _productCodeList: [ "00020", "00024" ]
        }

        await generateOrder(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('it should return 200 and all orders that are stored', async() => {
        const res = mockResponse()

        await getAll(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 200 and the order with the code specified', async () => {
        const res = mockResponse()
        req.params = { codOrder: "000549" }

        await getOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code is wrong', async () => {
        const res = mockResponse()
        req.params = { codOrder: "000877" }

        await getOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
    })

    it('it should return 401 if the code is not specified', async () => {
        const res = mockResponse()
        req.params = { codOrder: "" }

        await getOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid order data"})
    })

    it('it should return 200 and the order updated with a new status', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codOrder: "000549"
            },
            body:{
                _status: "Completed"
            }
        };

        await updateOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if updating order status without correct order code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codOrder: "000877"
            }, body:{
                _status: "Completed"
            }
        };

        await updateOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
    })

    it('it should return 401 if updating order status without specified the order code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codOrder: ""
            }, body:{
                _status: "Completed"
            }
        };
        await updateOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid order data"})
    })
});