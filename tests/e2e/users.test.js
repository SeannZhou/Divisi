const request = require('supertest');
const bcrypt = require('bcrypt')
const app = require('../../server');

var sampleUser = {
    "name": "testUser",
    "email": "testUser@gmail.com",
    "password": "12345678",
    "password2": "12345678"
}

jest.useFakeTimers()

describe('user requests', () => {
    
    let userId = null;
    it('should create a user successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(sampleUser);
        // console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual(sampleUser.name);
        userId = res.body._id;
        console.log(userId);
    });
    it('should delete a user successfully', async() => {
        const res = await request(app)
            .delete(`/api/users/${sampleUser["email"]}`)
        // console.log(res);
        expect(res.statusCode).toEqual(200);
    });
});