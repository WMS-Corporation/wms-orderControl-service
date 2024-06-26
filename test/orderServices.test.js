const dotenv = require('dotenv')
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../src/config/dbConnection");
const {generateOrder, getAll, getOrderByCode, updateOrderByCode} = require("../src/services/orderServices");
const {describe, beforeEach, it, expect, beforeAll, afterAll} = require('@jest/globals')

dotenv.config()
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}
const req = {
    body : "",
    user : "",
    params: "",
    headers: {
        authorization: 'Bearer some-token'
    }
}
const mockFetch = jest.fn().mockImplementation(async (url, requestOptions) => {
    const defaultResponse = {
        ok: true,
        json: async () => ({ someData: 'someValue' })
    }

    return Promise.resolve(defaultResponse);
})
global.fetch = mockFetch

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
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request body. Please ensure all required fields are included and in the correct format.'})
    })

    it('it should return 401 if the product is not defined', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _date: "14/03/2024",
            _status: "pending",
            _productList: [{
                "_codProduct": "000012",
                "_quantity": 20
            }, {
                "_codProduct": "000036",
                "_quantity": 30
            }]
        }

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });
        await generateOrder(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not defined.' });
    })

    it('it should return 200 if the order generation is successful', async () => {
        const res = mockResponse()
        req.body = {
            _date: "14/03/2024",
            _status: "pending",
            _productList: [{
                "_codProduct": "000010",
                "_quantity": 20
            }, {
                "_codProduct": "000034",
                "_quantity": 30
            }]
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

    it('it should return 200 and the order updated with a new product list', async () => {
        const res = mockResponse()
        req.params =  {codOrder: "000549"}
        req.body = {_productList: [
                {
                    _codProduct: "001103",
                    _quantity: 12
                }
            ]}

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

    it('it should return 401 if try to updating field that is not specified for the order ', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codOrder: "000549"
            }, body:{
                _name: "Order 1"
            }
        };
        await updateOrderByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid request body. Please ensure all required fields are included and in the correct format."})
    })

    it('it should return 401 if try to updating shelf data with a new product that is not defined', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _date: "14/03/2024",
            _status: "pending",
            _productList: [{
                "_codProduct": "000012",
                "_quantity": 20
            }]
        }

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });
        await updateOrderByCode(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not defined.' });
    });

})