exports.config = {
  mongodbUrl : 'mongodb://localhost/wuzy',
  avatars : {
    url: 'http://localhost:8080/avatars/',
    path: '././public/img/avatars/'
  },
  mail: {
    from: 'WUZY Mailer <wuzy.mailer@gmail.com>', // for SMTP
    transport: 'SMTP',
    transportOptions: {
      service: 'Gmail',
      auth: {
        user: 'wuzy.mailer@gmail.com',
        pass: 'GxxInCME4Y'
      }
    }
  }
};
