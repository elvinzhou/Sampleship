const express = require('express'),
  app = express()
  bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');
const emailfunc = require("./emailfunc");
const shipping = require("./shipping.js");
const db = require('better-sqlite3')('./db/samples.db');
const path=require('path');
var session = require('express-session')
require('dotenv').config({path: "./production.env"});
const port = process.env.PORT || 5000;
var env = process.env.NODE_ENV || 'development';
var sessionsecret = process.env.secret || 'keyboard cat';

var checkdb = db.exec('SELECT count(*) FROM sqlite_master');
if (checkdb == 0) {
  db.exec('/db/init.sql');
}


var corsOptions = {
  origin: true,
  credentials: true
};

app.options('*',cors(corsOptions));

app.use(cors(corsOptions));
console.log(sessionsecret);
app.use(session({
  secret: sessionsecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    path: "/"
   }
}))

app.set('trust proxy', true)


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/api/valaddress', function (req,res) {
  shipping.validateAddresses(req.body).then(validatedaddress => {
    res.send(validatedaddress);
    console.log(validatedaddress);
  })
})

app.get('/healthcheck', function(req,res) {
  res.sendStatus(200);
})

app.post('/api/statusupdate', function (req,res) {
  console.log(req.body);
  const shipmentId = req.body.esi;
  console.log(shipmentId)
  var dbupdate = db.prepare('UPDATE samples SET status = 1 where sid = ?').run(shipmentId);
  res.sendStatus(200);
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
  var reqdb = db.prepare('SELECT fname,lname,phone,address, eshipmentid from samples WHERE rowid = ?').all(rowid);
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
  if (response.eshipmentid) {
    var eshipment = response.eshipmentid;
  } else {
    var eshipmentid = uuidv4();
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
  const esi = eshipmentid;
  var shipmentdeets = {
    validateAddress:"validate_and_clean",
    externalOrderId: esi,
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
    var rates = data.rateResponse.rates; /*Brings rates in */
    var sid = data.shipmentId;
    db.prepare('UPDATE samples SET sid = ? WHERE rowid = ?').run(sid, rowid);
    /*Need to save shipmentID and set statuscode to 1;*/
    res.send(rates);
  });
})

app.post('/api/labelreq', function(req,res) {
  console.log(req.body);
  shipping.createlabel(req.body.rateId).then(data => {
    var labelId = data.labelId;
    var shipmentId = data.shipmentId;
    var eshipmentid = data.externalOrderId;
    var shipmentCost = JSON.stringify(data.shipmentCost);
    var tnumber = data.trackingNumber;
    var carrierCode = data.carrierCode;
    var serviceCode = data.serviceCode;
    var label = data.labelDownload.pdf;
    var package = JSON.stringify(data.packages);
    var labeldb = db.prepare('INSERT INTO labels (labelId, shipmentId, shipmentCost, tnumber, carrierCode, serviceCode, label, package, eshipmentid) VALUES (?,?,?,?,?,?,?,?,?)').run(labelId, shipmentId, shipmentCost, tnumber, carrierCode, serviceCode, label, package, eshipmentid);
    res.send(data);
    shipping.trackUsingLabelId(labelId).then(data => {
      var tnumber = data.trackingNumber;
      var status = statusCode;
      var labeldb = db.prepare('UPDATE labels SET status = ? WHERE tnumber = ?').run(status,tnumber);
    })
  });
})

app.post('/track', (req, res) => {

  let trackingNumber = req.body.data.tracking_number;
  let statusCode = req.body.data.status_code;

  var statusupdate = db.prepare('UPDATE labels SET status = ? WHERE tnumber = ?').run(statusCode, trackingNumber);
  res.sendStatus(200);
});


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
  const randuuid = uuidv4();
  var sampledb = db.prepare('INSERT INTO samples (fname, lname, samples, date, cemail, semail, al1, al2, al3, city, state, zip, status, address, eshipmentid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(fname,lname,samples,date,cemail,semail,al1,al2,al3,city,state,zip,status,address,randuuid);
  //not implemented yet
  /* notificationmail(requestJSON,semail); */
  res.send('Request Received. An email will be sent to you with updated tracking info when package is mailed.');
})

app.post('/api/osreq', function (req,res) {
  var statuscode = req.body.statuscode;
  var reqdb = db.prepare('SELECT rowid,fname,lname,cemail,samples,address,eshipmentid,sid from samples WHERE status = ?').all(statuscode);
  if (statuscode == 1) {
    for (const i in reqdb) {
      const esi = reqdb[i].sid;
      var tnumberdb = db.prepare('SELECT tnumber,status,trackurl FROM labels WHERE shipmentId = ?').get(esi);
      reqdb[i].tnumber = tnumberdb.tnumber;
    }
  }
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
      var userupdate = db.prepare('INSERT INTO users(email,name,picture) VALUES (?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture').run(email,name,picture);
      var user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      req.session.userID = user.ID;
      console.log(req.session.userID);
      res.status(201);
      res.json(user);
      } else {
      res.status(403)
    }
} )

app.use(async (req, res, next) => {
    var finduser = db.prepare('SELECT * FROM users WHERE ID = ?');
    console.log("userIDM:" + req.session.userID);
    const user = await finduser.get(req.session.userID);
    req.user = user;
    console.log(req.user);
    next()
})


app.get("/api/v1/auth/me", async (req, res) => {
    console.log(req);
    console.log(req.session);
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
