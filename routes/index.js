
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

exports.tasks = function(req, res){
  res.render('tasks', { title: 'Tasks' })
};

exports.ataglance = function(req, res){
  res.render('at-a-glance', { title: 'At a Glance' })
};

exports.billing = function(req, res){
  res.render('billing', { title: 'Billing & Account' })
};

exports.connections = function(req, res){
  res.render('connections', { title: 'API Connections' })
};

exports.settings = function(req, res){
  res.render('settings', { title: 'Settings' })
};

exports.setup = function(req, res){
  res.render('setup', { title: 'First time Setup' })
};

exports.tasksnew = function(req, res){
  res.render('tasks-new', { title: 'Setup a New Task Template'})
};