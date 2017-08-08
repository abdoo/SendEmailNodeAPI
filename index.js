'use strict';

const express = require('express');
var bodyParser = require('body-parser');


var config = require('./config');

var helper = require('sendgrid').mail;
//var mail = new helper.Mail();

var fromEmail = new helper.Email(config.fromEmail, config.fromName);

// Constants
const PORT = config.port;

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
      res.send('Hello world\n');
});


app.post('/sendEmail', function (req, res){
    var recipients = req.headers['emailrecipients'];
    var subject = req.headers['emailsubjects'];
    var toEmail = new helper.Email(recipients);

    console.log(req.body);

    var content = new helper.Content('text/html', JSON.stringify(req.body));

    console.log(content);

    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

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
