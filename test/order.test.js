const {createOrderFromData} = require("../src/factories/orderFactory");
const path = require("path");
const fs = require("fs");
const {describe, it, expect, beforeAll} = require('@jest/globals')

describe('Order testing', () => {
    let order;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, './Resources/MongoDB/WMS.Order.json')
        const orderData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        order = createOrderFromData(orderData)
    });

    it('should return the correct codOrder', () => {
        expect(order.codOrder).toBe("000549");
    });

    it('should return the correct date', () => {
        expect(order.date).toBe('20/03/2023');
    });

    it('should return the status state', () => {
        expect(order.status).toBe('pending');
    });

    it('should return the number of products', () => {
        expect(order.productList.length).toBe(2);
    });

    it('should set codTask correctly', () => {
        order.codTask = '000005';
        expect(order.codTask).toBe('000005');
    });

    it('should set date correctly', () => {
        order.date = '25/03/2023';
        expect(order.date).toBe('25/03/2023');
    });

    it('should set status correctly', () => {
        order.status = 'Completed';
        expect(order.status).toBe('Completed');
    });
});