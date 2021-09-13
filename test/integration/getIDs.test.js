const app = require('../server');
const supertest = require('supertest');

test('GET /getIDs', async () => {
    await supertest(app).get('/getIDs')
        .expect(200)
        .then((response) => {
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(["Demo1", "Demo2", "Demo3"]));
        })
});