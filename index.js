const express = require('express'),
  app = express()
  bodyParser = require('body-parser');
const fs = require('fs');
const emailfunc = require("./emailfunc");
const shipping = require("./shipping.js");
const db = require('better-sqlite3')('./db/samples.db');
const path=require('path');
var session = require('express-session')
require('dotenv').config();
const port = process.env.PORT || 5000;
var env = process.env.NODE_ENV || 'development';

var checkdb = db.exec('SELECT count(*) FROM sqlite_master');
if (checkdb == 0) {
  db.exec('/db/init.sql');
}

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

if (env == 'production'){
app.use(express.static(path.resolve(__dirname, './client/build')));
//Serve Index page
}
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/api/valaddress', function (req,res) {
  const validatedaddress = validateaddress(req.body);
  res.send(validatedaddress);
})

app.post('/api/getrates', async function(req,res) {
  var submitvalues = req.body;
  console.log('submitvalues:' + submitvalues)
  var rowid = submitvalues.row;
  var length = submitvalues.length;
  var width = submitvalues.width;
  var height = submitvalues.height;
  var weight = submitvalues.weight;
  var warehouseid = submitvalues.warehouseid;
  var reqdb = db.prepare('SELECT fname,lname,phone,address from samples WHERE rowid = ?').all(rowid);
  console.log(reqdb);
  var firstelement = reqdb[0];
  console.log(firstelement);
  var response = firstelement;
  var name = response.fname + ' ' + response.lname;
  if (response.phone) {
    var phone = response.phone;
  } else {
    var phone = "9999999999"
  }
  var jsonaddress=JSON.parse(response.address);
  var al1 = jsonaddress.line1;
  var al2 = jsonaddress.line2;
  var city = jsonaddress.city;
  var state = jsonaddress.state;
  var zip = jsonaddress.zip;
  var warehouseid = 1;
  var addfrom = db.prepare('SELECT waddress from locations where warehouseid = ?').all(warehouseid);
  console.log(addfrom);
  var shipfrom = JSON.parse(addfrom[0].waddress);
  var shipmentdeets = {
    validateAddress:"validate_and_clean",
    shipTo:{
      name:name,
      phone:phone,
      addressLine1: al1,
      addressLine2: al2,
      cityLocality: city,
      stateProvince: state,
      postalCode: zip,
      countryCode: "US",
    },
    shipFrom:shipfrom,
    packages: [
      {
        "weight":{
          "value": weight,
          "unit":"pound",
        },
        "dimensions":{
          "unit":"inch",
          "length":length,
          "width":width,
          "height":height,
        },
      },
    ]
  }
  shipping.getRates(shipmentdeets).then(data => {
    var rates = data.rateResponse.rates;
    var rateobj = JSON.parse(rates.reduce((acc,item,index) => {
      acc[`rate$(index)`] = item;
      return acc;
    },{}));
    console.log(data.rateResponse.errors[0])
    console.log('rates ' + rateobj);
    res.send(rateobj);
  });
})

app.post('/api/getlabel', function(req,res) {
  const label = createLabel(req.body);
  res.send(label);
})

app.post('/api/samplereqpost', function (req,res) {
  console.log(req.body);
  var fname =req.body.fname;
  var lname =req.body.lname;
  var address =req.body.address;
  var al1 = req.body.address.line1;
  var al2 = req.body.address.line2;
  var al3 = req.body.address.line3;
  var city = req.body.address.city;
  var state = req.body.address.state;
  var zip = req.body.address.zip;
  var address = JSON.stringify(req.body.address);
  var samples =req.body.samples;
  var date =req.body.date;
  var cemail =req.body.cemail;
  var semail =req.body.semail;
  var status = 0;
  var sampledb = db.prepare('INSERT INTO samples (fname, lname, samples, date, cemail, semail, al1, al2, al3, city, state, zip, status, address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(fname,lname,samples,date,cemail,semail,al1,al2,al3,city,state,zip,status,address);
  //not implemented yet
  /* notificationmail(requestJSON,semail); */
  res.send('Request Received. An email will be sent to you with updated tracking info when package is mailed.');
})

app.post('/api/osreq', function (req,res) {
  var statuscode = req.body.statuscode;
  console.log(statuscode);
  var reqdb = db.prepare('SELECT rowid,fname,lname,cemail,samples,address from samples WHERE status = ?').all(statuscode);
  console.log(reqdb);
  res.json(JSON.stringify(reqdb));
})

app.patch('/api/osreq', function (req,res) {
  var changes = req.body;
  console.log(req.body);
})

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)
app.post("/api/v1/auth/google", async (req, res) => {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    /* This is from original implementation using ORM
    const { name, email, picture } = ticket.getPayload();
    const user = await db.user.upsert({
        where: { email: email },
        update: { name, picture },
        create: { name, email, picture }
    }) */

    // New implementation directly using SQL
    const { name, email, picture, hd } = ticket.getPayload();
    if (hd === 'vibecartons.com') {
      var userupdate = db.prepare('INSERT INTO users(email,name,picture) VALUES (@email,@name,@picture) ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture').run(name,email,picture);
      var user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      req.session.userID = user.id;
      res.status(201);
      res.json(user);
      } else {
      res.status(403)
    }
} )

app.use(async (req, res, next) => {
    var finduser = db.prepare('SELECT * FROM users WHERE id = ?');
    if (req.session.authorized) {
      const user = await finduser.get(req.session.userId);
      req.user = user;
      next()
    }
})


app.get("/api/v1/auth/me", async (req, res) => {
    console.log(req.body);
    res.status(200);
    res.json(req.user);
})

app.delete("/api/v1/auth/logout", async (req, res) => {
    await req.session.destroy();
    res.status(200);
    res.json({
        message: "Logged out successfully"
    });
})


function notificationmail(request,semail){
  const {EOL} = require('os');
  //ParseJSON
  var info = JSON.parse(requestJSON);
  var messagereq = `A new sample request has been submitted.${EOL}Submission Data:${EOL}${info}${EOL} For more info go to https://samples.vibecartons.com.`;
  var toemail = 'samples@vibecartons.com';
  var subject = 'A new sample request has been submitted';
  emailfunc(messagereq,subject,toemail,semail);
}

app.listen(port,function(){
  console.log('Server responding on Port', port);
})
