
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
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

// Routes
app.set('view options', { pretty: true });
app.get('/', routes.index);
app.get('/reports', routes.reports);
app.get('/users', routes.users);
  app.get('/new-user', routes.newuser);
  app.get('/user-profile', routes.userprofile);
app.get('/clients', routes.clients);
app.get('/tasks', routes.tasks);
app.get('/at-a-glance', routes.ataglance);
app.get('/billing', routes.billing);
app.get('/connections', routes.connections);
app.get('/settings', routes.settings);
app.use(function(req, res, next){
  res.render('404.jade', {title: "404 - Page Not Found", showFullNav: false, status: 404, url: req.url });
});
app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});