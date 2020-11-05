const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../config/express');
const mongoose = require('../../config/mongoose');
var sampleUser = {
    "name": "testUser",
    "email": "testUser@gmail.com",
    "password": "12345678",
    "password2": "12345678"
}

describe('user requests', () => {
    // setup
    beforeAll(async () => {
        mongoose.connect();
    });

    // teardown
    afterAll(async () => {
        // await mongoose.connection.close();
        // await mongoose.disconnect()
        if (server) {
            await server.close();
          }
          mongoose.connections.forEach(async con => {
            await con.close();
          });
          await mockgoose.mongodHelper.mongoBin.childProcess.kill();
          await mockgoose.helper.reset();
          await mongoose.disconnect();
    });

    let userId = null;
    it('should create a user successfully', async () => {
        request(app)
            .post('/api/users/register')
            .send(sampleUser)
            .expect(httpStatus.CREATED)
            .then(res => {
                expect(res.body.name).toEqual(sampleUser.name);
            })
    });
    it('should delete a user successfully', async () => {
        request(app)
            .delete(`/api/users/${sampleUser["email"]}`)
            .expect(httpStatus.OK);
    });
});
