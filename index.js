'use strict';

const express = require('express');

var helper = require('sendgrid').mail;
//var mail = new helper.Mail();

var fromEmail = new helper.Email("abdul.fattah.hussein@ericsson.com", "Abdelfattah Antar");

// Constants
const PORT = process.env.PORT || 1337;

// App
const app = express();

app.get('/', function (req, res) {
      res.send('Hello world\n');
});


app.post('/sendEmail', function (req, res){
    var recipients = req.headers['emailrecipients'];
    var Name = req.headers['fullName'];
    var subject = req.headers['emailsubjects'];
    var toEmail = new helper.Email(recipients, Name);
    var content = new helper.Content('text/plain','easy to go with NodeJS');

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
    });
    res.send('Email sent');

});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
