exports.config = {
  mongodbUrl : 'mongodb://heroku_app14220631:sa8fb17r1tvvijse1atvnrasbl@ds063177.mongolab.com:63177/heroku_app14220631',
  avatars : {
    url: '/avatars/',
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
