//'use strict';

const express = require('express');
var bodyParser = require('body-parser');


var config = require('./config');

var helper = require('sendgrid').mail;

// Constants
const PORT = process.env.PORT || config.port;

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());


var auth = function (req, res, next) {
  
  var userName = config.username;
  var password = config.password;

  
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  // Designed for AppIOT authentication (ex. "Authorization: Basic : dGVzdDp0ZXN0MTIz")

  var userPassword = new Buffer(req.headers.authorization.split(" ")[2], 'base64').toString();

  //console.log(userPassword);

  var user = {};

  user.name = userPassword.split(":")[0];
  user.pass = userPassword.split(":")[1];

  //console.log(user.name);
  //console.log(user.pass);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === userName && user.pass === password) {
    return next();
  } else {
    console.log("wrong username and password");
    console.log(userName);
    console.log(password);
    return unauthorized(res);
  };
};

app.get('/', function (req, res) {
      res.send('Hello world\n');
});


app.post('/sendEmail', auth, function (req, res){

  var mail = new helper.Mail();

  var fromEmail = new helper.Email(config.fromEmail, config.fromName);

  mail.setFrom(fromEmail);

  var subject = req.headers['emailsubjects'];
  mail.setSubject(subject);

  var recipients = req.headers['emailrecipients'];
  
  var personalization = new helper.Personalization();

  var str_array = recipients.split(',');

  for(var i = 0; i < str_array.length; i++) {
    // Trim the excess whitespace.
    str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

    var email = new helper.Email(str_array[i]);
    personalization.addTo(email);
  }

  mail.addPersonalization(personalization);

  var reqBody = req.body;
  if (reqBody === null || reqBody === {} ){
    var content = new helper.Content('text/plain', 'Please check error happened');      
  }
  else{
    var content = new helper.Content('text/html', JSON.stringify(reqBody));
  }

  mail.addContent(content);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

  var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
  });

  sg.API(request, function (error, response){
        if (error) {
            console.log('Error response received');
            res.send('Failed to send email');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        res.send('Email sent');
  });
    
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
