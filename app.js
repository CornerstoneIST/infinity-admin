
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express)
  , config = require('./config/config').config;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.logger({ format: '\x1b[1m:status \x1b[1m:method \x1b[0m \x1b[33m:url \x1b[0m :response-time ms' }));
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new MongoStore({
      url: config.mongodbUrl
    }),
    cookie: { domain: '.wuzy.com' },
    secret: 'hMmbCcSLGFPTTvnsqgvDFddQo1d5t5ru'
  }));
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

app.get('/', routes.checkUser, routes.index);
app.get('/api/users', routes.checkUser, routes.getusers);
app.get('/api/user', routes.checkUser, routes.getuser);
app.get('/api/clients', routes.checkUser, routes.getclients);
app.get('/api/import-freshbooks', routes.checkUser, routes.getFreshbooksClients);
app.get('/api/import-zendesk', routes.checkUser, routes.getZendeskUsers);
app.get('/api/tickets', routes.checkUser, routes.gettickets);
app.post('/api/new-user', routes.checkUser, routes.newuser);
app.post('/api/new-owner', routes.checkUser, routes.newowner);
app.put('/api/save-app', routes.checkUser, routes.sineapp);
app.post('/api/import-users/:app', routes.checkUser, routes.saveImportUsers);
app.get('/api/get-company', routes.checkUser, routes.getcompany);
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
app.get('/setup', routes.checkUser, routes.setup);
app.get('/:action', routes.checkUser, routes.index);
app.get('/users/:action', routes.checkUser, routes.index);
app.get('/users/import/:action', routes.checkUser, routes.index);
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