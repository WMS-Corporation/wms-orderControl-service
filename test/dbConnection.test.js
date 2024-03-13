const { MongoClient } = require('mongodb');
const { connectDB, collections, closeDB} = require('../src/config/dbConnection');
const dotenv = require('dotenv');

dotenv.config();
describe('Database Connection', () => {
    let connection;
    let db;
    let ordersCollection;


    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.DB_CONN_STRING);
        db = connection.db(process.env.DB_NAME);
        ordersCollection = db.collection(process.env.ORDER_COLLECTION);
    });

    afterAll(async () => {
        await connection.close();
        await closeDB()
    });

    it('should connect to the database and collection', async () => {
        await connectDB(process.env.DB_NAME);
        expect(db.databaseName).toBe("WMS");
        expect(collections.orders).toBeDefined();
        expect(collections.orders.collectionName).toBe(ordersCollection.collectionName);

    });

});