
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' })
};

exports.zendeskapi = function(req, res){
	res.render('apps/zendesk-api', { title: 'Configure Zendesk API' })
};

exports.freshbooksapi = function(req, res){
	res.render('apps/freshbooks-api', { title: 'Configure FreshBooks API'})
};
