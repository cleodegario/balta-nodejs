'use strict';
var config = require('../config');
var sendgrid = require('sendgrid')(config.sendgridKey);

exports.send = async(to, subject, body) =>{
    sendgrid.send({
        to: to,
        from: 'hello@teste.com',
        subject: 'subject',
        html: body
    });
}