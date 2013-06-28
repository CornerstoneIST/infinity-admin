
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Dashboard' })
};

exports.reports = function(req, res){
  res.render('reports', { title: 'Reports' })
};

exports.users = function(req, res){
  res.render('users', { title: 'Users' })
};

  exports.userprofile = function(req, res){
    res.render('user-profile', { title: 'View User' })
  };

    exports.newuser = function(req, res){
    res.render('new-user', { title: 'Create a New User' })
  };

exports.clients = function(req, res){
  res.render('clients', { title: 'Clients' })
};

exports.rates = function(req, res){
  res.render('rates', { title: 'Rates' })
};

exports.ataglance = function(req, res){
  res.render('at-a-glance', { title: 'At a Glance' })
};

exports.billing = function(req, res){
  res.render('billing', { title: 'Billing & Account' })
};

exports.timeentries = function(req, res){
  res.render('time-entries', { title: 'Time Entries' })
};

exports.settings = function(req, res){
  res.render('settings', { title: 'Settings' })
};

exports.setup = function(req, res){
  res.render('setup', { title: 'First time Setup' })
};

exports.ratesnew = function(req, res){
  res.render('rates-new', { title: 'Setup a New Rate Template'})
};