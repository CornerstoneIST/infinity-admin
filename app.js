
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , config = require('./config/config').config;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.logger({ format: '\x1b[1m:status \x1b[1m:method \x1b[0m \x1b[33m:url \x1b[0m :response-time ms' }));
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
// Compatible

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
}

// Prettify the HTML
app.set('view options', { pretty: true });
// Set Routes

app.get('/', routes.index);
app.get('/api/users', routes.getusers);
app.get('/api/user', routes.getuser);
app.get('/api/clients', routes.getclients);
app.get('/api/tickets', routes.gettickets);
app.post('/new-user', routes.newuser);
app.post('/new-owner', routes.newowner);
// app.get('/reports', routes.reports);
// app.get('/users', routes.users);
  // app.get('/new-user', routes.newuser);
  // app.get('/user-profile', routes.userprofile);
// app.get('/clients', routes.clients);
// app.get('/tasks', routes.tasks);
  // app.get('/tasks-new', routes.tasksnew);
// app.get('/at-a-glance', routes.ataglance);
// app.get('/billing', routes.billing);
// app.get('/time-entries', routes.timeentries);
// app.get('/settings', routes.settings);
// app.get('/setup', routes.setup);
app.get('/:action', routes.index);
app.get('/users/:action', routes.index);
app.get('/activation/:id', routes.activation);
app.post('/api/activation/:id', routes.activateUser);

// Set 404 Page Not Found
app.use(function(req, res, next){
  res.render('404.jade', {title: "404 - Page Not Found", showFullNav: false, status: 404, url: req.url });
});

mongoose.connect(config.mongodbUrl, function (err) {
  if (err) {
    throw new Error('Unable to connect to MongoDB');
  }

  console.log('\r\n Connected to MongoDb v.' + mongoose.version);

  // Heroku Port Activated
  app.listen(process.env.PORT || 8080, function(){
    console.log("\r\n Wuzy Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

});