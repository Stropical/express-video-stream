process.env.PORT = 8081;

const { app, server } = require('../server');
const supertest = require('supertest');

test('GET /vidChunk without ID', async () => {
    await supertest(app).get('/vidChunk')
        .expect(400)
        .then((response) => {
            expect(JSON.stringify(response.body)).toBe("{}")
        })
});

test('GET /vidChunk without range', async () => {
    await supertest(app).get('/vidChunk?id=Demo1')
        .expect(400)
        .then((response) => {
            expect(JSON.stringify(response.body)).toBe("{}")
        })
});

test('GET /vidChunk without range', async () => {
    await supertest(app).get('/vidChunk?id=Demo1')
        .set('range', 'bytes=0-')
        .expect(206)
        .then((response) => {
            return;
        })
});

server.close();
//Can't test 409 just yet