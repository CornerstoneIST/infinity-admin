var
  fs = require('fs'),
  jade = require('jade'),
  config = require('../config/config').config,
  mandrill = require('mandrill-api/mandrill'),
  mandrill_client = new mandrill.Mandrill(config.mail.mandrill_key),
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

exports.sendMemberRegisterMail = function (user) {
  var
    subject = 'Registration',
    html = tpl('memberRegister', {
      subject: subject,
      user: user
    });
  
  var message = {
      "html": html,
      "subject": subject,
      "from_email": config.mail.from,
      "from_name": "WUZY",
      "to": [{
              "email": user.email,
              "name": user.name
          }],
      "important": false,
      "track_opens": null,
      "track_clicks": null,
      "auto_text": null,
      "auto_html": null,
      "inline_css": null,
      "url_strip_qs": null,
      "preserve_recipients": null,
      "tracking_domain": null,
      "signing_domain": null
  };
  mandrill_client.messages.send(
    {"message": message},
    function(result) {
        console.log(result);
    },
    function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
};

