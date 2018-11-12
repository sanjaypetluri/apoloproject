var express=require('express');
var app=express();
var mongodb=require('mongodb').MongoClient;
var path=require('path');
var bodyParser=require('body-parser');
var uniqid = require('uniqid');
var uniqidGenerator = require ('node-unique-id-generator');
var bCrypt=require('bcrypt');
var jsonwebtoken=require('jsonwebtoken');
var uid;



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'dist/Task')))
var dbo;

mongodb.connect("mongodb://sahajanandasanjay:7287993699p@ds247171.mlab.com:47171/notice",function(err,db)
{
    if(err) throw err;
    dbo=db.db('notice');

    app.post('/one',function (req, res) {
        console.log(req.body);
        dbo.collection('patentdetails').insert(req.body, (err, result) => {
            if (err) throw err;
            
            console.log(result);
            dbo.collection('patentdetails').find().toArray((err,data)=>{
    
                if(err) throw err;
                res.send(data);
    
            })
        })
        })





        app.get('/one',function(req,res){
            dbo.collection('patentdetails').find().toArray(function(err,receive){
                if(err) throw err;
                console.log(receive);
                res.send(receive);

            })
         })

       

        app.post('/two',function (req, res) {
            console.log(req.body);
            req.body.uid=uniqid();

            


            dbo.collection('patentdetails').findOne({"phone":req.body.phone},function(err,info){
                if (err) throw err;
                console.log('info is '+info);

                if(info==null)
                {
                    console.log("the data started here !!!!!!!!!!!!!!!!!!!!!")
                    console.log(req.body.uid);
                    bCrypt.hash(req.body.password,10,(err,hash)=>{
                        dbo.collection('patentdetails').insert({"name":req.body.name,"dob":req.body.dob,"gender":req.body.gender,"phone":req.body.phone,"email":req.body.email,"uid":req.body.uid,"password":hash}, (err, result) => {
                            if (err) throw err;
                            console.log(result);
                           res.send({"msg":"Welcome user"});  
                    })
                                          
                  })
                }

                else
                {
                    res.send({"msg":"Phonenumber is existed in Database"});

                    console.log( "phone num is there");
                }

            })



            })

            app.get('/totalusers',function(req,res){
                dbo.collection('patentdetails').find().toArray(function(err,receive){
                    if(err) throw err;
                    res.send(receive);
                })
            })

            app.post('/login',function(req,res){
                console.log(req.body);
                var phone=req.body.phone;
                var password=req.body.password;
            
                console.log(phone);
                console.log(password);
                dbo.collection('patentdetails').findOne({"phone":phone},(err,result)=>{
                if(err) throw err;
 
                    if(result){
                //valid username        
                        bCrypt.compare(req.body.password,result.password,(err,pass)=>{

                            if(pass){
                            //valid password
                            console.log("valid user");
                            var jwtBearerToken=jsonwebtoken.sign({uid:result.uid},'hello');
                            console.log(jwtBearerToken);
                            res.status(200).json({idToken:jwtBearerToken,expiresIn:'1h'})
                            }
                            else{
                            //valid invalid password
                            console.log("invalid password");
                                res.send({"msg":"invalid password"});
                      }
                     })
                }
                else{
                //invalid username
                console.log("invalid user name");
                res.send({"msg":"invalid username"});
                
                }     
                })
            })
})
// app.listen(9000); 
app.listen(process.env.PORT||8080,()=>{
    console.log("server started");
})