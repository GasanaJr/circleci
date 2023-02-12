const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose')
const chai = require('chai');
const User = require('../models/User');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe("USERS Test", () => {
    before((done) => {
        const testUser = new User({
            name: "Didas Junior Gasana",
            email: "gasanajr08@gmail.com",
            password: "helloworld"
        });
        testUser.save((err,user) => {
            done();
        })
    });
    after((done) => {
        User.collection
        .drop()
        .then(() =>{

        }).catch(() => {
            console.warn("Collection may not exist");
        });
        done();

    });
    
    it("Should list ALL USERS on GET /api/user", (done) => {
        chai.request(app)
        .get('/api/user')
        .end((err,res) => {
            if(err) done(err);
            else {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                // res.body[0].should.have.property('name');
                // res.body[0].should.have.property('email');
                // res.body[0].should.have.property('_id');
                done()
            }
        });
    });

    it("Should REGISTER a new user on POST /api/user/register", (done) => {
        chai.request(app)
        .post('/api/user/register')
        .send({
            name: "Mocha Chai",
            email: "mocha@chai.com",
            password: "mochachai"
        })
        .end((err,res) => {
            if(err) done(err);
            else {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            }
        })
    });

    it("Should LOGIN a USER on POST /api/user/login", (done) => {
        chai.request(app)
        .post('/api/user/login')
        .send({
            email: "mocha@chai.com",
            password: "mochachai",
        })
        .end((err,res) => {
            if(err) done(err);
            else {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('token');
                done();
            }
        })
        
    });
});