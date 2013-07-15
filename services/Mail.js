var
  nodemailer = require('nodemailer'),
  fs = require('fs'),
  jade = require('jade'),
  config = require('../config/config').config,
  tpl;
tpl = function (templateName, locals) {
  var
    fileName = process.cwd() + '/templates/mail/' + templateName + '.jade',
    fn = jade.compile(fs.readFileSync(fileName, 'utf8'), {
      filename: fileName,
      pretty: true
    });

  locals = locals || {};
  locals.title = 'Wuzy';

  return fn(locals);
};

exports.sendMail = function (mailOptions, callback) {
  var mailTransport = nodemailer.createTransport(config.mail.transport, config.mail.transportOptions);

  mailOptions = mailOptions || {};
  mailOptions.from = config.mail.from;
  mailOptions.generateTextFromHTML = true;

  mailTransport.sendMail(mailOptions, callback);

  mailTransport.close();
};
exports.sendMemberRegisterMail = function (user, callback) {
  var
    subject = 'Registration',
    body;

  body = tpl('memberRegister', {
    subject: subject,
    user: user
  });

  exports.sendMail({
    to: user.email,
    subject: subject,
    html: body
  }, callback);
};
