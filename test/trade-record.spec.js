const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../api/index')

const should = chai.should()
const expect = chai.expect
chai.use(chaiHttp)

describe('trade-record', () => {
  it('should response status 200', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('should response data', (done) => {
    chai.request(app)
      .get('/api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.code.should.equal(0)
        expect(res.body.data.list).to.be.a('array')
        done()
      })
  })

  it('should response address error', (done) => {
    chai.request(app)
      .get('/api/txs?a=0xeb2a81e229b68c1c22')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.code.should.gt(0)
        done()
      })
  })
})