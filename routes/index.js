var
  fs = require('fs'),
  config = require('../config/config').config,
  generatePassword = require('password-generator'),
  MailService = require('../services/Mail');
  User = require('../schemas/user'),
  Client = require('../schemas/client'),
  Plan = require('../schemas/plan'),
  Company = require('../schemas/company'),
  Ticket = require('../schemas/ticket');

exports.index = function(req, res){
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
  var user = new User(req.body);
  user.type = 'user';
  user.save(function (err, user) {
    if (err) {
      console.error(err);
      res.send('error saving User', 500);
      return;
    }
    MailService.sendUserRegisterMail(user);
    res.send(user);
  })
};

exports.getusers = function(req, res){
  User.find().skip(req.query.per_page * (req.query.page - 1)).limit(req.query.per_page).exec(function (err, users) {
    if (err || !users) {
      console.error(err);
      res.send('Users not found', 400);
      return;
    }
    User.count({}, function( err, count){
      if (err) {
        console.error(err);
      }
      res.send({
        collection:  users,
        count: count
      });
    })
  })
};
exports.getuser = function(req, res){
  User.findById(req.query.id).exec(function (err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    res.send(user);
  })
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
  })
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
    user.password = req.body.password;
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
    })
  })
};

exports.newticket = function(req, res){
  var ticket = new Ticket(req.body);
  
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
  })
};
exports.gettickets = function(req, res){
  Ticket.find().populate('client user').skip(req.query.per_page * (req.query.page - 1)).limit(req.query.per_page).exec(function (err, tickets) {
    if (err || !tickets) {
      console.error(err);
      res.send('Tickets not found', 400);
      return;
    }
    Ticket.count({}, function( err, count){
      if (err) {
        console.error(err);
      }
      res.send({
        collection:  tickets,
        count: count
      });
    })
  })
};

exports.getclients = function(req, res){
  Client.find().skip(req.query.per_page * (req.query.page - 1)).limit(req.query.per_page).exec(function (err, clients) {
    if (err || !clients) {
      console.error(err);
      res.send('Clients not found', 400);
      return;
    }
    Client.count({}, function( err, count){
      if (err) {
        console.error(err);
      }
      res.send({
        collection:  clients,
        count: count
      });
    })
  })
};

exports.setup = function(req, res){
  res.render('setup', {
    title: "SetUp",
    layout: false
  });
};

exports.newowner = function(req, res){
  var company = new Company;
  User.findById(req.session.user_id, function(err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    user.name = req.body.first_name + ' ' + req.body.last_name;
    user.recovery_email = req.body.recovery_email;
    user.sec_quest_1 = req.body.sec_quest_1;
    user.sec_quest_2 = req.body.sec_quest_2;
    user.sec_answer_1 = req.body.sec_answer_1;
    user.sec_answer_2 = req.body.sec_answer_2;
    user.stripeToken = req.body.stripeToken;
    user.activated = true;
    user.type = 'owner';
  
    var tempPath = req.files.avatar.path,
        newName = generatePassword(10, false) + '_' + req.files.avatar.name,
        targetPath = config.avatars.path + newName;
    fs.rename(tempPath, targetPath, function(err) {
      if (err) {
        console.error(err);
        res.send('error saving Avatar', 500);
        return;
      }
      user.avatar = newName;
  
      user.save(function (err, user) {
        if (err) {
          console.error(err);
          res.send('error saving User', 500);
          fs.unlink(targetPath, function(err) {
              if (err) throw err;
          });
          return;
        }
        company.name = req.body.name;
        company.address = req.body.address;
        company.floor = req.body.floor;
        company.code = req.body.code;
        company.city = req.body.city;
        company.province = req.body.province;
        company.country = req.body.country;
        company.owner = user;
        
        if (req.body.plan) {
          var plan = new Plan;
          plan.name = req.body.plan;
          plan.save(function (err, plan) {
            if (err) {
              console.error(err);
              res.send('error saving Plan', 500);
              return;
            }
            company.plan = plan;
            company.save(function (err, company) {
              if (err) {
                console.error(err);
                res.send('error saving Company', 500);
                Plan.findById(plan._id, function (err, doc) {
                  if (err) {
                    console.error(err);
                  }
                  if (doc) {
                    doc.remove();
                  }
                });
                fs.unlink(targetPath, function(err) {
                    if (err) throw err;
                });
                return;
              }
              res.send();
              return;
            });
          });
        } else {
          company.save(function (err, company) {
            if (err) {
              console.error(err);
              res.send('error saving Company', 500);
              fs.unlink(targetPath, function(err) {
                  if (err) throw err;
              });
              return;
            }
            res.send();
            return;
          });
        }
      });
    });
  });
};
