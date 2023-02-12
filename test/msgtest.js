const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose')
const chai = require('chai');
const User = require('../models/User');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe("MESSAGE Tests", ()=> {

    it("Should first create a user", (done) => {
        chai.request(app)
        .post('/api/user/register')
        .send({
            name: "Didas Junior Gasana",
            email: "gasanajr@gmail.com",
            password: "helloworld"
        })
        .end((err,res) => {
            if(err) done(err);
            else {
                done();
            };
        });
    });

    it("Should get ALL MESSAGES on GET /sendmsg", (done) => {
        chai.request(app)
        .post('/api/user/login')
        .send({
            email: "gasanajr@gmail.com",
            password: "helloworld"
        })
        .end((err,res) => {
            const token = res.body.token;
            chai.request(app)
            .get('/message')
            .set('auth-token', token)
            .end((error,response) => {
                if(error) done(error);
                else {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a("array");
                    response.body[0].should.have.property("name");
                    response.body[0].should.have.property("email");
                    response.body[0].should.have.property("content");
                    done();
                }
            });

        });
    });
    it("Should return a SPECIFIC MESSAGE on POST /message/id", (done) => {
        chai.request(app)
        .post('/api/user/login')
        .send({
            email: "gasanajr@gmail.com",
            password: "helloworld"
        })
        .end((err,res) => {
            const token  = res.body.token;
            chai.request(app)
            .get('/message')
            .set('auth-token', token)
            .end((err,res) => {
            chai.request(app)
            .get('/message/' + res.body._id)
            .set('auth-token', token)
            .end((error, response) => {
                if(error) done(error);
            else {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a("object");
                // response.body.should.have.property("name");
                // response.body.should.have.property("email");
                // response.body.should.have.property("content");
                done();
            }
            })
        })
        });
    });

    it("Should SEND a MESSAGE on POST /sendmsg/send",(done) => {
        chai.request(app)
        .post('/message/send')
        .send({
            name: "Didas Junior",
            email: "d.gasana@alustudent.com",
            content: "Testing with Mocha"
        })
        .end((err,res) => {
            if(err) done(err);
            else {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property("name");
                res.body.should.have.property("content");
                res.body.should.have.property("email");
                done()
            }
        });

    });

    it("Should delete a SPECIFIC MESSAGE on DELETE /message/id", (done) => {
        chai.request(app)
        .post('/api/user/login')
        .send({
            email: "gasanajr@gmail.com",
            password: "helloworld"
        })
        .end((err,res) => {
            const token  = res.body.token;
            chai.request(app)
            .get('/message')
            .set('auth-token', token)
            .end((err,res) => {
            chai.request(app)
            .delete('/message/' + res.body[0]._id)
            .set('auth-token', token)
            .end((error, response) => {
                if(error) done(error);
            else {
                response.should.have.status(200);
                response.should.be.json;
               // response.should.have.property("Message");
                // response.body.should.have.property("name");
                // response.body.should.have.property("email");
                // response.body.should.have.property("content");
                done();
            }
            })
        })
        });
    });

});