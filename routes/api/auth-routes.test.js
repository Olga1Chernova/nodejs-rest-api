const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = require('../../app');

const { User } = require('../../models/user');

const { SECRET_KEY, DB_HOST_TEST, PORT } = process.env;

describe("test /api/auth/login route", () => {
    let server = null;
    beforeAll(async () => {
        server = app.listen(PORT);
        await mongoose.connect(DB_HOST_TEST);
    })

    afterAll(async () => {
        server.close();
        await mongoose.connection.close();
    })

    test("test login route with correct data", async () => {
        const user = {
            subscription: "starter",
            email: "olya53800@gmail.com",
        };
        const userInfo = await User.findOne({ email: user.email });
        const { _id } = userInfo;
        const payload = {
            id: _id,
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
        const res = (await request(app).post("api/auth/login")).send(user, token);
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(user.email);
        expect(res.body.subscription).toBe(user.subscription);
    })
} )