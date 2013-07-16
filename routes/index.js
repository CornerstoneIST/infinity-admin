var
  fs = require('fs'),
  config = require('../config/config').config,
  generatePassword = require('password-generator'),
  MailService = require('../services/Mail');
  User = require('../schemas/user'),
  Client = require('../schemas/client'),
  Plan = require('../schemas/plan'),
  Company = require('../schemas/company'),
  Ticket = require('../schemas/ticket'),
  Member = require('../schemas/member');

exports.index = function(req, res){
  res.render('index');
};

exports.newmember = function(req, res){
  var member = new Member(req.body);
  if (req.body.password.length === 0) {
    member.password = generatePassword(10, false);
  }
  member.save(function (err, member) {
    if (err) {
      console.error(err);
      res.send('error saving Member', 500);
      return;
    }
    MailService.sendMemberRegisterMail(member);
    res.send(member);
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
      .populate('client member')
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

exports.getmembers = function(req, res){
  Member.find().exec(function (err, members) {
    if (err || !members) {
      console.error(err);
      res.send('Members not found', 400);
      return;
    }
    res.send(members);
  })
};

exports.gettickets = function(req, res){
  Ticket.find().populate('client member').exec(function (err, tickets) {
    if (err || !tickets) {
      console.error(err);
      res.send('Tickets not found', 400);
      return;
    }
    res.send(tickets);
  });
};

exports.getclients = function(req, res){
  Client.find().exec(function (err, clients) {
    if (err || !clients) {
      console.error(err);
      res.send('Clients not found', 400);
      return;
    }
    res.send(clients);
  })
};

exports.newowner = function(req, res){
  var user = new User,
      plan = new Plan,
      company = new Company;
  plan.name = req.body.plan;

  plan.save(function (err, plan) {
    if (err) {
      console.error(err);
      res.send('error saving Plan', 500);
      return;
    }
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.recovery_email = req.body.recovery_email;
    user.sec_quest_1 = req.body.sec_quest_1;
    user.sec_quest_2 = req.body.sec_quest_2;
    user.sec_answer_1 = req.body.sec_answer_1;
    user.sec_answer_2 = req.body.sec_answer_2;
    user.stripeToken = req.body.stripeToken;

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
          Plan.findById(user._id, function (err, doc) {
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
        company.name = req.body.name;
        company.address = req.body.address;
        company.floor = req.body.floor;
        company.code = req.body.code;
        company.city = req.body.city;
        company.province = req.body.province;
        company.country = req.body.country;
        company.owner = user;
        company.plan = plan;
        company.save(function (err, company) {
          if (err) {
            console.error(err);
            res.send('error saving Company', 500);
            User.findById(user._id, function (err, doc) {
              if (err) {
                console.error(err);
              }
              if (doc) {
                doc.remove();
              }
            });
            Plan.findById(user._id, function (err, doc) {
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
    });
  });
};
