var fs = require('fs')
  , config = require('../config/config').config
  , generatePassword = require('password-generator')
  , async = require('async')
  , bcrypt = require('bcrypt')
  , FreshBooks = require('freshbooks')
  , MailService = require('../services/Mail')
  , User = require('../schemas/user')
  , Client = require('../schemas/client')
  , Plan = require('../schemas/plan')
  , Company = require('../schemas/company')
  , Ticket = require('../schemas/ticket');

exports.index = function(req, res) {
  res.render('index');
};

exports.checkUser = function (req, res, next) {
  if (req.session && req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (err || !user) {
        console.error(err);
        res.redirect(config.signUrl);
        return;
      }
      if (user.type == 'owner') {
        Company.find({owner : user}).exec(function (err, comp) {
          if (err) {
            console.error(err);
            res.send(err, 400);
            return;
          } else if (comp.length === 0 && req.route.path != '/setup' && req.route.path != '/api/new-owner') {
            res.redirect('/setup');
            return;
          } else if (comp.length != 0 && (req.route.path == '/setup' || req.route.path == '/api/new-owner')) {
            res.redirect('/');
            return;
          } else {
            next();
          }
        })
      } else {
        res.redirect(config.signUrl);
      }
    });
  } else {
    res.redirect(config.signUrl);
  }
};

exports.newuser = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    User.find({
      company: MasterUser.company,
      email: req.body.email
    }).count(function (err, count) {
      if (err) {
        console.error(err);
        return
      } else if (count > 0) {
        res.send('This email is in use', 500);
        return;
      } else {
        var user = new User(req.body);
        user.type = 'user';
        user.company = MasterUser.company;
        user.save(function (err, user) {
          if (err) {
            console.error(err);
            res.send('error saving User', 500);
            return;
          }
          MailService.sendUserRegisterMail(user);
          res.send(user);
        });
      }
    });
  });
};

exports.getusers = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    User
      .find({
        company: MasterUser.company
      })
      .skip(req.query.per_page * (req.query.page - 1))
      .limit(req.query.per_page)
      .exec(function (err, users) {
        if (err || !users) {
          console.error(err);
          res.send('Users not found', 400);
          return;
        }
        User.where('company', MasterUser.company).count(function (err, count) {
          if (err) {
            console.error(err);
          }
          res.send({
            collection:  users,
            count: count
          });
        });
    });
  });
};

exports.getuser = function(req, res){
  User.findById(req.query.id).exec(function (err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    res.send(user);
  });
};

exports.getcompany = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    Company.findById(MasterUser.company, function(err, company) {
      if (err || !company) {
        console.error(err);
        res.send('Company not found', 400);
        return;
      }
      res.send(company);
    });
  });
};

exports.sineapp = function(req, res){
  Company.findById(req.body._id, function(err, company) {
    if (err || !company) {
      console.error(err);
      res.send('Company not found', 400);
      return;
    }
    company.integration = req.body.integration;
    company.save(function (err, user) {
      if (err) {
        console.error(err);
        res.send('error saving Company', 500);
        return;
      }
      res.send(company);
    });
  });
};

exports.activation = function(req, res){
  User.findById(req.params.id).exec(function (err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    res.render('activate-user', {
      title: "Activate User",
      layout: false,
      user: user,
      error: false
    });
  });
};

exports.activateUser = function(req, res){
  User.findById(req.params.id).exec(function (err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    if (user.activated) {
      res.render('activate-user', {
        title: "Activate User",
        layout: false,
        user: user,
        error: false
      });
      return;
    }
    if (req.body.password != req.body.confpassword) {
      res.render('activate-user', {
        title: "Activate User",
        layout: false,
        user: user,
        error: true
      });
      return;
    }
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      user.password = hash;
      user.activated = true;
      user.save(function (err, user) {
        if (err) {
          console.error(err);
          res.send('error saving User', 500);
          return;
        }
        res.render('activate-user', {
          title: "Activate User",
          layout: false,
          user: user,
          error: false
        });
      });
    });
  });
};

exports.newticket = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    var ticket = new Ticket(req.body);
    ticket.company = MasterUser.company;
    ticket.save(function (err, ticket) {
      if (err) {
        console.error(err);
        res.send('error saving Ticket', 500);
        return;
      }
      Ticket
        .findById(ticket.id)
        .populate('client user')
        .exec(function (err, ticket) {
          if (err || !ticket) {
            console.error(err);
            res.send('Ticket not found', 400);
            return;
          }
          res.send(ticket);
        });
    });
  });
};
exports.gettickets = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    Ticket
      .find({
        company: MasterUser.company
      })
      .populate('client user')
      .skip(req.query.per_page * (req.query.page - 1))
      .limit(req.query.per_page)
      .exec(function (err, tickets) {
        if (err || !tickets) {
          console.error(err);
          res.send('Tickets not found', 400);
          return;
        }
        Ticket.where('company', MasterUser.company).count(function (err, count) {
          if (err) {
            console.error(err);
          }
          res.send({
            collection:  tickets,
            count: count
          });
        });
      });
  });
};

exports.newclient = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    var client = new Client(req.body);
    client.company = MasterUser.company;
    client.save(function (err, client) {
      if (err) {
        console.error(err);
        res.send('error saving Client', 500);
        return;
      }
      Client
        .findById(client.id)
        .exec(function (err, client) {
          if (err || !client) {
            console.error(err);
            res.send('Client not found', 400);
            return;
          }
          res.send(client);
        });
    });
  });
};

exports.getclients = function(req, res){
   User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    Client
      .find({
        company: MasterUser.company
      })
      .skip(req.query.per_page * (req.query.page - 1))
      .limit(req.query.per_page)
      .exec(function (err, clients) {
        if (err || !clients) {
          console.error(err);
          res.send('Clients not found', 400);
          return;
        }
        Client.where('company', MasterUser.company).count(function (err, count) {
          if (err) {
            console.error(err);
          }
          res.send({
            collection:  clients,
            count: count
          });
        });
    });
  });
};
exports.getZendeskUsers = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    Company.findById(MasterUser.company, function(err, company) {
      if (err || !company) {
        console.error(err);
        res.send('Company not found', 400);
        return;
      }
      if (!company.integration.zendesk.subDomain || !company.integration.zendesk.apiKey || !company.integration.zendesk.username) {
        res.send('Zendesk params not found', 400);
        return;
      } else {

        var zendesk = require('node-zendesk')
          , client = zendesk.createClient({
              username:  company.integration.zendesk.username,
              token:     company.integration.zendesk.apiKey,
              remoteUri: company.integration.zendesk.subDomain + '/api/v2'
            });
        client.users.search({role: 'agent'}, function (err, req, zendeskUsers) {
          if (err) {
            console.log(err);
            res.send(err.toString(), 400);
            return;
          } else {
            User.find({'company': MasterUser.company}, function (err, users) {
              if (err) {
                console.log(err);
                res.send('Users not found', 400);
                return;
              } else {
                res.send({
                  appUsers: zendeskUsers,
                  actualUsers: users
                });
              }
            });
          }
        });
      }
    });
  });
}
exports.getFreshbooksClients = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    Company.findById(MasterUser.company, function(err, company) {
      if (err || !company) {
        console.error(err);
        res.send('Company not found', 400);
        return;
      }
      if (!company.integration.freshbooks.subDomain || !company.integration.freshbooks.apiKey) {
        res.send('Freshbooks params not found', 400);
        return;
      } else {
        var freshbooks = new FreshBooks(company.integration.freshbooks.subDomain, company.integration.freshbooks.apiKey)
        , client = new freshbooks.Client();
        client.list({folder: 'active'}, function(err, freshbooksClients) {
          if (err) {
            console.log(err);
            res.send(err + '', 400);
            return;
          } else {
            User.find({'company': MasterUser.company}, function (err, users) {
              if (err) {
                console.log(err);
                res.send('Users not found', 400);
                return;
              } else {
                res.send({
                  appUsers: freshbooksClients,
                  actualUsers: users
                });
              }
            });
          }
        });
      }
    });
  });
};

exports.saveImportUsers = function(req, res){
  User.findById(req.session.user_id, function(err, MasterUser) {
    if (err || !MasterUser) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    function saveClientIterator (item, cb) {
      var user = new User;
      if (req.params.app == 'zendesk') {
        user.name = item.name;
        user.phone = item.phone;
      } else if (req.params.app == 'freshbooks') {
        user.name = item.first_name + item.last_name;
        user.phone = item.mobile || item.work_phone || item.home_phone;
        user.state = item.p_state;
        user.street = item.p_street1;
        user.city = item.p_city;
        user.postal = item.p_code;
        user.website = item.url;
      }
      user.notes = item.notes;
      user.email = item.email;
      user.type = 'user';
      user.company = MasterUser.company;
      user.save(function (err, user) {
        if (err) {
          cb(err);
        }
        cb(null);
        MailService.sendUserRegisterMail(user);
      });
    };
    function callback (err) {
      if (err) {
        console.error(err);
        res.send('error saving Cliet', 500);
        return;
      }
      res.send();
    };
    async.each(req.body, saveClientIterator, callback);
  });
};

exports.setup = function(req, res){
  res.render('setup', {
    title: "SetUp",
    layout: false
  });
};

exports.newowner = function(req, res){
  User.findById(req.session.user_id, function (err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    async.waterfall([
      function (cb) {//plan
        if (req.body.plan) {
          var plan = new Plan;
          plan.name = req.body.plan;
          plan.save(function (err, plan) {
            if (err) {
              console.error(err);
              res.send('error saving Plan', 500);
              cb(err);
              return;
            }
          cb(null, plan)
          });
        } else {
          cb(null, null);
        }
      },
      function (plan, cb) {//company
        var company = new Company;
        company.name = req.body.name;
        company.address = req.body.address;
        company.floor = req.body.floor;
        company.code = req.body.code;
        company.city = req.body.city;
        company.province = req.body.province;
        company.country = req.body.country;
        company.owner = user;
        if (plan) {
          company.plan = plan;
        }
        company.save(function (err, company) {
          if (err) {
            console.error(err);
            res.send('error saving Company', 500);
            if (plan) {
              Plan.findById(plan._id, function (err, doc) {
                if (err) {
                  console.error(err);
                }
                if (doc) {
                  doc.remove();
                }
              });
            }
            cb(err);
            return;
          }
          cb(null, company);
        });
      },
      function (company, cb) {//avatar
        if (req.files.avatar) {
          var tempPath = req.files.avatar.path
            , newName = generatePassword(10, false) + '_' + req.files.avatar.name
            , targetPath = config.avatars.path + newName;
          fs.rename(tempPath, targetPath, function (err) {
            if (err) {
              console.error(err);
            }
            cb(null, company, newName);
          });
        } else {
          cb(null, company, 'noPhoto');
        }
      },
      function (company, avatar, cb) {//user
        user.name = req.body.first_name + ' ' + req.body.last_name;
        user.recovery_email = req.body.recovery_email;
        user.sec_quest_1 = req.body.sec_quest_1;
        user.sec_quest_2 = req.body.sec_quest_2;
        user.sec_answer_1 = req.body.sec_answer_1;
        user.sec_answer_2 = req.body.sec_answer_2;
        user.stripeToken = req.body.stripeToken;
        user.activated = true;
        user.type = 'owner';
        user.avatar = avatar;
        user.company = company;
        user.save(function (err, user) {
          if (err) {
            console.error(err);
            res.send('error saving User', 500);
            if (avatar != 'noPhoto') {
              fs.unlink(config.avatars.path + user.avatar, function (err) {
                  if (err) throw err;
              });
            }
            if (company.plan) {
              Plan.findById(company.plan._id, function (err, doc) {
                if (err) {
                  console.error(err);
                }
                if (doc) {
                  doc.remove();
                }
              });
            }
            Company.findById(company._id, function (err, doc) {
              if (err) {
                console.error(err);
              }
              if (doc) {
                doc.remove();
              }
            });
          }
          res.send();
          return;
        });
      }
    ]);
  });
};
