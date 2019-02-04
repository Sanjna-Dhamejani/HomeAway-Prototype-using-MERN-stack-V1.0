//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var mysql = require('mysql');
var pool = require('./pool');
var bcrypt = require('bcryptjs');
const port = process.env.PORT || 3001;
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
var photostore ="";
var fetchowneremail =""
var searchresults = []
var properemail=""
var uproperemail=""
var countlocation = 0
var coundetails = 0
var countpricing = 0
var countprofile = 0
var countsignup =0
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
secret              : 'cmpe273_kafka_passport_mongo',
resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
res.setHeader('Cache-Control', 'no-cache');
next();
});

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, './uploads');
},
filename: (req, file, cb) => {

const newFilename = `${file.originalname}`;
cb(null,  Date.now()+'-'+newFilename);
},
});

const upload = multer({ storage });

app.post('/pphotos', upload.single('selectedFile'), (req, res) => {
//console.log("Req : ",req);
//console.log("Res : ",res.file);
console.log("Printing filename",res.req.file.filename)
photostore=res.req.file.filename
console.log("Inside photos Post");
console.log("Posting photos for : ", fetchowneremail)
var sql = "INSERT INTO proppics(email, picname) VALUES ( " + 
mysql.escape(fetchowneremail) + " , " + mysql.escape(photostore) + " )";
console.log(sql);
pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
con.query(sql,function(err,result){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Error While Creating Location");
    }else{
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end('Photos Added Successfully');
    }
});
}
})

})

app.post('/profilepic/:email', upload.single('selectedFile'), (req, res) => {
    //console.log("Req : ",req);
    //console.log("Res : ",res.file);
    console.log("Printing filename",res.req.file.filename)
    photostore=res.req.file.filename
    console.log("Inside photos Post user");

    var sql = "UPDATE userdetails SET profilepicname = " + mysql.escape(photostore) +" WHERE uemail = " + mysql.escape(req.params.email)
    console.log(sql);
    pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
    con.query(sql,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error While Creating Location");
        }else{
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end('Photos Added Successfully');
        }
    });
    }
    })
    
    })

app.post('/download/:file(*)',(req, res) => {
console.log("Inside download file");
var file = req.params.file;
var fileLocation = path.join(__dirname + '/uploads',file);
var img = fs.readFileSync(fileLocation);
var base64img = new Buffer(img).toString('base64');
res.writeHead(200, {'Content-Type': 'image/jpg' });
res.end(base64img);
});

app.post('/ologin',function(req,res){
console.log("Inside Login Post Request");
var email = req.body.email;
properemail = (req.body.email).replace("%40", "@")
fetchowneremail = properemail
console.log("Fetchowneremail:", fetchowneremail)
console.log("Setting up login for :", properemail);
var password = req.body.password;
var sql = "SELECT * FROM ownerdetails WHERE email = " + mysql.escape(email);
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Invalid Credentials");
            }else{
                console.log(result[0]);
                if(result[0].password){
                    bcrypt.compare(req.body.password, result[0].password, function(err, results) {
                        console.log('User pwd ', password)
                        console.log('Pwd in Database ', result[0].password)
                        if(results) {
                res.cookie('cookie',properemail,{maxAge: 900000, httpOnly: false, path : '/'});
                req.session.user = result;
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Successful Login");
                }
                else{
                    res.end("Password was incorrect")
                }
            
        });
    }
    }
});
    }
});

});

app.post('/osignup',function(req,res){
console.log("Inside Signup Post");
var salt = bcrypt.genSaltSync(10);
var encryptedpassword = bcrypt.hashSync(req.body.password, salt);
var sql2 ="SELECT COUNT(1) FROM ownerdetails where email = " + mysql.escape(req.body.email)
var sql = "INSERT INTO ownerdetails(firstname, lastname, email, password) VALUES ( " + 
mysql.escape(req.body.firstname) + " , " + mysql.escape(req.body.lastname) + " , "+
mysql.escape(req.body.email) + "," +  mysql.escape(encryptedpassword) + " ) ";
console.log(sql)
pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
    con.query(sql2,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");   
        }else{
            // res.writeHead(200,{
            //     'Content-Type' : 'application/json'
            // })
            console.log("Printing count packet",JSON.stringify(result));
            var resultString = JSON.stringify(result)
            countsignup = resultString.substring(13,14)
            console.log("Printing count signup "+ countsignup);
            //res.end(JSON.stringify(result));

            if(countsignup==0){
                console.log("inside countsign=0",sql)
                con.query(sql,function(err,result2){
                    if(err){
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Could Not Get Connection Object");   
                    }else{
                        res.writeHead(200,{
                            'Content-Type' : 'application/json'
                        })
                        console.log("Printing select packet",JSON.stringify(result2));
                        res.end(JSON.stringify(result2));
                }
                
            });
        }
        else {
            res.writeHead(202,{
                'Content-Type' : 'application/json'
            })
            console.log("Inside when nothing")
            res.end("Email already used.");         
        }
    
}
})
}
})

})

app.post('/plocation',function(req,res){
console.log("Inside location Post");
properemail = (req.body.email).replace("%40", "@")
console.log("Posting location for : ", properemail)
var sql = "INSERT INTO propertylocation(email, city, state, country) VALUES ( " + 
mysql.escape(properemail) + " , " + mysql.escape(req.body.city) + " , "+
mysql.escape(req.body.ostate) + "," +  mysql.escape(req.body.country) + " ) ";

pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
con.query(sql,function(err,result){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Error While Creating Location");
    }else{
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end('Location Created Successfully');
    }
});
}
}) 
})

app.put('/plocation', function(req,res){
console.log("Inside location Update");
properemail = (req.body.email).replace("%40", "@")
console.log("Updating location for : ", properemail)
var sql ="UPDATE propertylocation SET country = " + mysql.escape(req.body.country) + ", city = " + mysql.escape(req.body.city) + ", state = " + mysql.escape(req.body.ostate) +" WHERE email = " + mysql.escape(properemail)
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
    con.query(sql,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error While Updating Location");
        }else{
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end('Location Updated Successfully');
        }
    });
}
}) 
})

//Route to get All Location Details when owner visits the Location Page
app.get('/plocation/:email', function(req,res){

console.log("Inside get for location: ",req.params.email)
var sql = "SELECT COUNT(1) FROM propertylocation WHERE email = " + mysql.escape(req.params.email);
var sql2 = "SELECT * FROM propertylocation WHERE email = " + mysql.escape(req.params.email);
pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
    con.query(sql,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");   
        }else{
            // res.writeHead(200,{
            //     'Content-Type' : 'application/json'
            // })
            console.log("Printing count packet",JSON.stringify(result));
            var resultString = JSON.stringify(result)
            countlocation = resultString.substring(13,14)
            console.log("Printing count location "+ countlocation);
            //res.end(JSON.stringify(result));

            if(countlocation==1){
                con.query(sql2,function(err,result2){
                    if(err){
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Could Not Get Connection Object");   
                    }else{
                        res.writeHead(200,{
                            'Content-Type' : 'application/json'
                        })
                        console.log("Printing select packet",JSON.stringify(result));
                        res.end(JSON.stringify(result2));
                }
                
            });
        }
        else {
            console.log("inside when nothing")
            res.json([{"email":req.params.email,"propertyid":0,"city":"","state":"","country":""}]);         
        }
    
}
})
}
})
})


app.post('/pdetails',function(req,res){
console.log("Inside Details Post");
properemail = (req.body.email).replace("%40", "@")
fetchemail = properemail
console.log("Posting location for : ", properemail)
var sql = "INSERT INTO propertydescription(email, headline, descript, propertytype, bedrooms, accomodates, bathrooms) VALUES ( " + 
mysql.escape(properemail) + " , " + mysql.escape(req.body.headline) + " , "+
mysql.escape(req.body.descript) + "," + mysql.escape(req.body.propertytype) + " , " + mysql.escape(req.body.bedrooms) + " , " + mysql.escape(req.body.accomodates) + " , " + mysql.escape(req.body.bathrooms) + " ) ";

pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
con.query(sql,function(err,result){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Error While Creating Student");
    }else{
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end('Details Created Successfully');
    }
});
}
})

})

app.put('/pdetails', function(req,res){
console.log("Inside details Update");
properemail = (req.body.email).replace("%40", "@")
console.log("Updating details for : ", properemail)
    var sql ="UPDATE propertydescription SET headline = " + mysql.escape(req.body.headline) + ", descript = " + mysql.escape(req.body.descript) + ", propertytype = " + mysql.escape(req.body.propertytype) + ", bedrooms = " + mysql.escape(req.body.bedrooms) + ", accomodates = " + mysql.escape(req.body.accomodates) + ", bathrooms = " + mysql.escape(req.body.bathrooms) + " WHERE email = " + mysql.escape(properemail)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While Updating Details");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end('Details Updated Successfully');
            }
        });
    }
    }) 
})

//Route to get All Location Details when owner visits the Location Page
app.get('/pdetails/:email', function(req,res){

console.log("Inside get for details: ",req.params.email)
var sql = "SELECT COUNT(1) FROM propertydescription WHERE email = " + mysql.escape(req.params.email);
    var sql2 = "SELECT * FROM propertydescription WHERE email = " + mysql.escape(req.params.email);
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Could Not Get Connection Object");   
            }else{
                // res.writeHead(200,{
                //     'Content-Type' : 'application/json'
                // })
                console.log("Printing count packet",JSON.stringify(result));
                var resultString = JSON.stringify(result)
                countdetails = resultString.substring(13,14)
                console.log("Printing count details "+ countlocation);
                //res.end(JSON.stringify(result));

                if(countdetails==1){
                    con.query(sql2,function(err,result2){
                        if(err){
                            res.writeHead(400,{
                                'Content-Type' : 'text/plain'
                            })
                            res.end("Could Not Get Connection Object");   
                        }else{
                            res.writeHead(200,{
                                'Content-Type' : 'application/json'
                            })
                            console.log("Printing select packet",JSON.stringify(result));
                            res.end(JSON.stringify(result2));
                    }
                    
                });
            }
            else {
                console.log("inside when nothing")
                res.json([{"email":req.params.email,"propertyid":0,"headline":"","descript":"","propertytype":"","bedrooms":"","accomodates":"","bathrooms":""}]);         
            }
        
    }
})
}
})
})

app.post('/ppricing',function(req,res){
console.log("Inside Pricing Post");
properemail = (req.body.email).replace("%40", "@")
console.log("Posting location for : ", properemail)
var sql = "INSERT INTO ownerpricing(email, startdate, enddate, currency) VALUES ( " + 
mysql.escape(properemail) + " , " + mysql.escape(req.body.startdate) + " , "+
mysql.escape(req.body.enddate) + "," + mysql.escape(req.body.currency) +  " ) ";

pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
con.query(sql,function(err,result){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Error While Creating Student");
    }else{
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end('Pricing Created Successfully');
    }
});
}
})

})

app.put('/ppricing', function(req,res){
console.log("Inside Pricing Update");
properemail = (req.body.email).replace("%40", "@")
console.log("Updating pricing for : ", properemail)
    var sql ="UPDATE ownerpricing SET startdate = " + mysql.escape(req.body.startdate) + ", enddate = " + mysql.escape(req.body.enddate) + ", currency = " + mysql.escape(req.body.currency) +  " WHERE email = " + mysql.escape(properemail)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While Updating Pricing");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end('Pricing Updated Successfully');
            }
        });
    }
    }) 
})

//Route to get All Location Details when owner visits the Location Page
app.get('/ppricing/:email', function(req,res){

console.log("Inside get for pricing: ",req.params.email)
var sql = "SELECT COUNT(1) FROM ownerpricing WHERE email = " + mysql.escape(req.params.email);
var sql2 = "SELECT * FROM ownerpricing WHERE email = " + mysql.escape(req.params.email);
pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
    con.query(sql,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");   
        }else{
            // res.writeHead(200,{
            //     'Content-Type' : 'application/json'
            // })
            console.log("Printing count packet",JSON.stringify(result));
            var resultString = JSON.stringify(result)
            countpricing = resultString.substring(13,14)
            console.log("Printing count pricing "+ countpricing);
            //res.end(JSON.stringify(result));

            if(countpricing==1){
                con.query(sql2,function(err,result2){
                    if(err){
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Could Not Get Connection Object");   
                    }else{
                        res.writeHead(200,{
                            'Content-Type' : 'application/json'
                        })
                        console.log("Printing select packet",JSON.stringify(result));
                        res.end(JSON.stringify(result2));
                }
                
            });
        }
        else {
            console.log("Inside when nothing")
            res.json([{"email":req.params.email,"propertyid":0,"startdate":"","enddaate":"","currency":""}]);         
        }
}
})
}
})
})
app.post('/tlogin',function(req,res){
console.log("Inside User Login Post Request");
uproperemail = (req.body.uemail).replace("%40", "@")
ufetchemail=uproperemail
console.log("Setting up user login for :", uproperemail)
    var password = req.body.upassword;
    var sql = "SELECT *  FROM userdetails WHERE uemail = " + mysql.escape(uproperemail)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Invalid Credentials");
                }else{
                    console.log(result[0]);
                    if(result[0].upassword){
                        bcrypt.compare(req.body.upassword, result[0].upassword, function(err, results) {
                            console.log('User pwd ', req.body.upassword)
                            console.log('Pwd in Database ', result[0].upassword)
                            if(results) {
                    res.cookie('cookie',uproperemail,{maxAge: 900000, httpOnly: false, path : '/'});
                    req.session.user = result;
                        res.writeHead(200,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Successful Login");
                    }
                    else{
                        res.end("Password was incorrect")
                    }
                
            });
        }
        }
    });
        }
    });
    
    });
app.post('/tsignup',function(req,res){
console.log("Inside User Signup Post");
var salt = bcrypt.genSaltSync(10);
var encryptedpassword = bcrypt.hashSync(req.body.upassword, salt);
var sql2 ="SELECT COUNT(1) FROM userdetails where uemail = " + mysql.escape(req.body.uemail)
var sql = "INSERT INTO userdetails(ufirstname, ulastname, uemail, upassword) VALUES ( " + 
mysql.escape(req.body.ufirstname) + " , " + mysql.escape(req.body.ulastname) + " , "+
mysql.escape(req.body.uemail) + "," +  mysql.escape(encryptedpassword) + " ) ";
console.log(sql)
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
        con.query(sql2,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Could Not Get Connection Object");   
            }else{
                // res.writeHead(200,{
                //     'Content-Type' : 'application/json'
                // })
                console.log("Printing count packet",JSON.stringify(result));
                var resultString = JSON.stringify(result)
                countsignup = resultString.substring(13,14)
                console.log("Printing count signup "+ countsignup);
                //res.end(JSON.stringify(result));
    
                if(countsignup==0){
                    con.query(sql,function(err,result2){
                        if(err){
                            res.writeHead(400,{
                                'Content-Type' : 'text/plain'
                            })
                            res.end("Could Not Get Connection Object");   
                        }else{
                            res.writeHead(200,{
                                'Content-Type' : 'application/json'
                            })
                            console.log("Printing select packet",JSON.stringify(result));
                            res.end(JSON.stringify(result2));
                    }
                    
                });
            }
            else {
                res.writeHead(202,{
                    'Content-Type' : 'application/json'
                })
                console.log("Inside when nothing")
                res.end("Email already used.");         
            }
        
    }
    })
    }
    })
    
    })
app.put('/profile', function(req,res){
    console.log("Inside Profile Update");
    uproperemail = (req.body.uemail).replace("%40", "@")
    console.log("Updating location for : ", uproperemail)
        var sql ="UPDATE userdetails SET aboutme = " + mysql.escape(req.body.aboutme) + ", citycountry = " + mysql.escape(req.body.citycountry) + ", company = " + mysql.escape(req.body.company) +", school = " + mysql.escape(req.body.school) +", hometown = " + mysql.escape(req.body.hometown) +", phone = " + mysql.escape(req.body.phone) +", languages = " + mysql.escape(req.body.languages) +", gender = " + mysql.escape(req.body.gender) +" WHERE uemail = " + mysql.escape(uproperemail)
        console.log(sql)
        pool.getConnection(function(err,con){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Could Not Get Connection Object");
            }else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Error While Updating Profile");
                }else{
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end('Profile Updated Successfully');
                }
            });
        }
        }) 
    })

//Route to get All Location Details when owner visits the Location Page
app.get('/profile/:email', function(req,res){
    console.log("Inside get for profile: ",req.params.email)
        var sql = "SELECT * FROM userdetails WHERE uemail = " + mysql.escape(req.params.email);
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");   
                }else{
                    res.writeHead(200,{
                        'Content-Type' : 'application/json'
                    })
                    console.log("Get profile:",JSON.stringify(result))
                    res.end(JSON.stringify(result));
        }
    })
}
})
})

app.post('/home',function(req,res){
    console.log("Inside Home Post Request");
    var email = (req.body.uemail).replace("%40", "@")
    // properemail = (req.body.uemail)
    // fetchemail = properemail
    console.log("Setting up login for :", email)
    console.log("The destination is: " + req.body.destination)
    console.log("The arive date is: " + req.body.arrive)
    console.log("The depart date is: " + req.body.depart)
    console.log("The no of guests is: " + req.body.guests)
    var sql = "SELECT * FROM propertylocation pl INNER JOIN propertydescription pd on pl.email = pd.email INNER JOIN ownerpricing op on pd.email = op.email INNER JOIN proppics pp on op.email = pp.email WHERE lower(pl.city) = '" + (req.body.destination)+"' AND op.startdate <= '" + (req.body.arrive) + "' AND op.enddate >= '" + (req.body.depart) + "' AND pd.accomodates >= " + (req.body.guests) + " GROUP BY pp.email"
    console.log(sql)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While Creating Search");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(result))
            }
        });
    }
    })
        
    });

app.post('/displayprop',function(req,res){
    console.log("Inside booking Post Request");
    var email = (req.body.uemail).replace("%40", "@")
    console.log("User email in display prop", email)
    var sql = "INSERT INTO booking(owneremail, useremail, startdate, enddate, bookingflag) VALUES ("+mysql.escape(req.body.oemail)+","+mysql.escape(email)+", "+ mysql.escape(req.body.startdate) + "," + mysql.escape(req.body.enddate) +", 1 )"
    console.log(sql)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While Creating Search");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(result))
            }
        });
    }
    })
        
    });

app.get('/displayprop/:email', function(req,res){
console.log("Inside get for displaying a specific property")
var sql = "SELECT * FROM propertylocation pl INNER JOIN propertydescription pd on pl.email = pd.email INNER JOIN ownerpricing op on pd.email = op.email WHERE pl.email = '" + (req.params.email) + "'"
//console.log(sql)
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Could Not Get Connection Object");   
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'application/json'
                })
                //console.log(JSON.stringify(result))
                res.end(JSON.stringify(result));
            }
        });
    }
})

})

app.post('/displaypropphotos', function(req,res){
console.log("Inside get for pics for email:", req.body.oemail);
var sql = "SELECT * FROM proppics WHERE email = " + mysql.escape(req.body.oemail)
console.log(sql)
pool.getConnection(function(err,con){
    if(err){
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Could Not Get Connection Object");
    }else{
        con.query(sql,function(err,result){
            if(err){
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Could Not Get Connection Object");   
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'application/json'
                })
                var emails =[]
                for(var i=0; i<result.length;i++)
                {
                    emails.push(result[i].picname)
                }
                 //console.log("Post photos result:",emails)
                // res.send()
                console.log("Photos array to be sent",JSON.stringify(emails))
                res.end(JSON.stringify(emails));
            }
        });
    }
})

})

app.get('/mytrips/:email', function(req,res){
    console.log("Inside get for displaying a specific property")
    var sql = "SELECT pd.headline, pd.descript, pd.bathrooms, pd.bedrooms, pl.city, pl.country, op.startdate, op.enddate, op.currency FROM propertylocation pl INNER JOIN propertydescription pd ON pl.email = pd.email INNER JOIN ownerpricing op ON pd.email = op.email INNER JOIN booking bk ON op.email = bk.owneremail WHERE bk.useremail = "+mysql.escape(req.params.email)
    console.log(sql)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");   
                }else{
                    res.writeHead(200,{
                        'Content-Type' : 'application/json'
                    })
                    console.log(JSON.stringify(result))
                    res.end(JSON.stringify(result));
                }
            });
        }
    })
    
    })

app.get('/plocation/:email', function(req,res){

console.log("Inside get for location: ",req.params.email)
var sql = "SELECT COUNT(1) FROM propertylocation WHERE email = " + mysql.escape(req.params.email);
var sql2 = "SELECT * FROM propertylocation WHERE email = " + mysql.escape(req.params.email);
pool.getConnection(function(err,con){
if(err){
    res.writeHead(400,{
        'Content-Type' : 'text/plain'
    })
    res.end("Could Not Get Connection Object");
}else{
    con.query(sql,function(err,result){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");   
        }else{
            // res.writeHead(200,{
            //     'Content-Type' : 'application/json'
            // })
            console.log("Printing count packet",JSON.stringify(result));
            var resultString = JSON.stringify(result)
            countlocation = resultString.substring(13,14)
            console.log("Printing count location "+ countlocation);
            //res.end(JSON.stringify(result));

            if(countlocation==1){
                con.query(sql2,function(err,result2){
                    if(err){
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Could Not Get Connection Object");   
                    }else{
                        res.writeHead(200,{
                            'Content-Type' : 'application/json'
                        })
                        console.log("Printing select packet",JSON.stringify(result));
                        res.end(JSON.stringify(result2));
                }
                
            });
        }
        else {
            console.log("inside when nothing")
            res.json([{"email":req.params.email,"propertyid":0,"city":"","state":"","country":""}]);         
        }
    
}
})
}
})
})

app.get('/odashboard/:email', function(req,res){
    console.log("Inside get for displaying a specific ownerdashboard")
    var sql = "SELECT * FROM propertylocation pl INNER JOIN propertydescription pd ON pl.email = pd.email INNER JOIN ownerpricing op ON pd.email = op.email INNER JOIN booking bk ON op.email = bk.owneremail WHERE bk.bookingflag = 1 AND bk.owneremail =" +mysql.escape(req.params.email)
    console.log(sql)
    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");   
                }else{
                    res.writeHead(200,{
                        'Content-Type' : 'application/json'
                    })
                    console.log(JSON.stringify(result))
                    res.end(JSON.stringify(result));
                }
            });
        }
    })
    
    })


app.listen(3001);
console.log("Server Listening on port 3001");