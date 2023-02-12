const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose')
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe("TESTING LANDING page", () => {
    it("Should display We are on home", (done) => {
        chai.request('app')
        .get('/')
        .end((err,res) => {
            if(err) done(err);
            else {
                res.should.have.status(200);
                res.should.be.json;
                done();
            }
        });
    });
});
