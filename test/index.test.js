//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./rsc/server');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET book', () => {
    it('it should GET all the books', (done) => {
      chai.request(server)
          .get('/getids')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);
            done();
          });
    });
});