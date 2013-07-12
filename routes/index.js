var
  fs = require('fs'),
  config = require('../config/config').config,
  generatePassword = require('password-generator'),
  User = require('../schemas/user'),
  Plan = require('../schemas/plan'),
  Company = require('../schemas/company');
  Member = require('../schemas/member');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.userprofile = function(req, res){
  res.render('user-profile', { title: 'View User' });
};

exports.newuser = function(req, res){
  res.render('new-user', { title: 'Create a New User' });
};

exports.tasksnew = function(req, res){
  res.render('tasks-new', { title: 'Setup a New Task Template'});
};

exports.newmember = function(req, res){
  var member = new Member(req.body),
  tempPath = req.files.avatar.path,
  newName = generatePassword(10, false) + '_' + req.files.avatar.name,
  targetPath = config.avatars.path + newName;
  fs.rename(tempPath, targetPath, function(err) {
    if (err) {
      console.error(err);
      res.send('error saving Avatar', 500);
      return;
    }
    member.avatar = newName;
    member.save(function (err, member) {
      if (err) {
        console.error(err);
        res.send('error saving Member', 500);
        fs.unlink(targetPath, function(err) {
            if (err) throw err;
        });
        return;
      }
      res.send(member);
    })
  });
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
            doc.remove();
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
              doc.remove();
            });
            Plan.findById(user._id, function (err, doc) {
              doc.remove();
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
