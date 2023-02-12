 const request = require('supertest');
 const app = require('../app');
 const mongoose = require('mongoose')
 const chai = require('chai');
 const chaiHttp = require('chai-http');
 const User = require('../models/User')
 const should = chai.should();

 chai.use(chaiHttp);

 describe("CRUD Test", () => {    
     describe("OPERATIONS ON POSTS", ()=> {
        it("Should first create a user", (done) => {
            chai.request(app)
            .post('/api/user/register')
            .send({
                name: "Didas Junior Gasana",
                email: "d.gasana@alustudent.com",
                password: "helloworld"
            })
            .end((err,res) => {
                if(err) done(err);
                else {
                    done();
                };
            });
        });

         it("Should return all the saved POSTS on GET /post", (done) => {
             chai.request(app)
             .get('/posts')
             .end((err,res) => {
                 if(err) done(err);
                 else {
                     res.should.have.status(200);
                     res.should.be.json;
                     res.body.should.be.a("array");
                     res.body[0].should.have.property("title");
                     res.body[0].should.have.property("description");
                     res.body[0].should.have.property("_id");
           done();

                 }
             });
         });
         it("Should return a SPECIFIC POST on GET /posts/id", (done) => {
             chai.request(app)
             .post('/api/user/login')
             .send({
                 email: "d.gasana@alustudent.com",
                 password: "helloworld"
             })
             .end((err,res) => {
                 const token  = res.body.token;
                 chai.request(app)
                 .get('/posts')
                 .end((err,res) => {
                 chai.request(app)
                 .get('/posts/' + res.body[0]._id)
                 .set('auth-token', token)
                 .end((error, response) => {
                     if(error) done(error);
                 else {
                     response.should.have.status(200);
                     response.should.be.json;
                     response.body.should.be.a("object");
                     response.body.should.have.property("title");
                     response.body.should.have.property("description");
                     response.body.should.have.property("_id");
                     done();
                 }
                 }) 
             })
             });
         });
         it("Should create a NEW POST on POST /posts", (done) => {
             chai.request(app)
             .post('/api/user/login')
             .send({
                 email: "d.gasana@alustudent.com",
                 password: "helloworld"
             }).end((err,res) => {
                 chai.request(app)
                 .post('/posts')
                 .send({
                     title: "First Mocha Test",
                     description: "Please work"
                 })
                 .set('auth-token', `${res.body.token}`)
                 .end((error, response) => {
                     response.should.have.status(201);
                     response.body.should.have.property("title");
                     response.body.should.have.property("description");
                     response.body.should.have.property("_id");
                     done();
                 });
             });
         });

         it("Should UPDATE A POST on PATCH /posts/id", (done) => {
             chai.request(app)
             .post('/api/user/login')
             .send({
                 email: "d.gasana@alustudent.com",
                 password: "helloworld"
             }).end((err,res) => {
                 if(err) done(err);
                 else {
                     const token = res.body.token;
                     chai.request(app)
                     .get('/posts')
                     .end((err,res) => {
                         chai.request(app)
                         .patch('/posts/' + res.body[0]._id)
                         .send({
                             title: "Updating using Mocha"
                         })
                         .set('auth-token', token)
                         .end((error, response) => {
                             response.should.have.status(200);
                            //response.body.should.have.property("title");
                            //response.body.should.have.property("description");
                            //response.body.should.have.property("_id");
                             done();
                         });
                     });
                 }
             });
         });



         it("Should DELETE A POST on DELETE /posts/id", (done) => {
             chai.request(app)
             .post('/api/user/login')
             .send({
                 email: "d.gasana@alustudent.com",
                 password: "helloworld"
             }).end((err,res) => {
                 if(err) done(err);
                 else {
                     const token = res.body.token;
                     chai.request(app)
                     .get('/posts')
                     .end((err,res) => {
                         chai.request(app)
                         .delete('/posts/' + res.body[0]._id)
                         .set('auth-token', token)
                         .end((error, response) => {
                             response.should.have.status(200);
                           // response.body.should.have.property("title");
                           // response.body.should.have.property("description");
                           // response.body.should.have.property("_id");
                             done();
                         });
                     });
                 }
             });
         });

         it("Should ADD A LIKE ON A POST on PUT /posts/like/id", (done) => {
            chai.request(app)
            .post('/api/user/login')
            .send({
                email: "d.gasana@alustudent.com",
                password: "helloworld"
            }).end((err,res) => {
                if(err) done(err);
                else {
                    const token = res.body.token;
                    chai.request(app)
                    .get('/posts')
                    .end((err,res) => {
                        chai.request(app)
                        .put('/posts/like/' + res.body[0]._id)
                        .set('auth-token', token)
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property("Message");
                          // response.body.should.have.property("title");
                          // response.body.should.have.property("description");
                          // response.body.should.have.property("_id");
                            done();
                        });
                    });
                }
            });
        });

        it("Should REMOVE A LIKE ON A POST on PUT /posts/unlike/id", (done) => {
            chai.request(app)
            .post('/api/user/login')
            .send({
                email: "d.gasana@alustudent.com",
                password: "helloworld"
            }).end((err,res) => {
                if(err) done(err);
                else {
                    const token = res.body.token;
                    chai.request(app)
                    .get('/posts')
                    .end((err,res) => {
                        chai.request(app)
                        .put('/posts/unlike/' + res.body[0]._id)
                        .set('auth-token', token)
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property("Message");
                          // response.body.should.have.property("description");
                          // response.body.should.have.property("_id");
                            done();
                        });
                    });
                }
            });
        });

         it("Should add a COMMENT on A POST on POST /comment/id", (done) => {
            chai.request(app)
            .post('/api/user/login')
            .send({
                email: "d.gasana@alustudent.com",
                password: "helloworld"
            }).end((err,res) => {
                if(err) done(err);
                else {
                    const token = res.body.token;
                    chai.request(app)
                    .get('/posts')
                    .end((er,resp) => {
                        chai.request(app)
                        .post('/posts/comment/' + resp.body[0]._id)
                        .send({
                            text: "First test comment"
                        })
                        .set('auth-token', token)
                        .end((error, response) => {
                            response.should.have.status(200);
                            // response.body[0].should.have.property("text");
                            // response.body[0].should.have.property("name");
                            // response.body[0].should.have.property("_id");
                            done();
                        });
                    });
                }
            });
        });
  });
 });



