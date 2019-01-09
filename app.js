const https = require("https"),
  fs = require("fs");  

const csp = require('helmet');
const frameguard = require('frameguard');

var express = require('express');
var querystring= require('querystring');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./settings')
var session = require('express-session')




const options = {
  key:fs.readFileSync('./shopify.vteamslabs.com/privkey1.pem'),
  cert:fs.readFileSync('./shopify.vteamslabs.com/cert1.pem')

};
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }))
app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('X-Frame-Options', '*');
    res.header('X-Frame-Options' , '*');   
    next();
});




// Shopify Authentication

// This function initializes the Shopify OAuth Process
// The template in views/embedded_app_redirect.ejs is rendered 


app.get('/render',function(req,res){

    console.log('rendering');
});
app.post('/webhooks/orders/create',(req, res) => {
    console.log('🎉 We got an order!',res);
    res.sendStatus(200)
    // // we'll compare the hmac to our own hash
    const hmac = req.get('X-Shopify-Hmac-Sha256')
  
    // create a hash using the body and our key
    // const hash = crypto
    //   .createHmac('sha256','46d14f99bb8d72dcaddb9ee8c5d25dc591c4a65574d0d3c36f9f17a412aac6e6')
    //   .update(req.body, 'utf8', 'hex')
    //   .digest('base64')
  
    // // Compare our hash to Shopify's hash
    // if (hash === hmac) {
    //   // It's a match! All good
    //   console.log('Phew, it came from Shopifify!')
    //   res.sendStatus(200)
    // } else {
    //   // No match! This request didn't originate from Shopify
    //   console.log('Danger! Not from Shopify!')
    //   res.sendStatus(403)
    // }
  });

app.get('/shopify_auth', function(req, res) {
    if (req.query.shop) {
        req.session.shop = req.query.shop;

        req.session.vat;
        res.render('embedded_app_redirect', {
            shop: req.query.shop,
            api_key: config.oauth.api_key,
            scope: config.oauth.scope,
            redirect_uri: config.oauth.redirect_uri
        });
    }
})

// After the users clicks 'Install' on the Shopify website, they are redirected here
// Shopify provides the app the is authorization_code, which is exchanged for an access token
app.get('/access_token', verifyRequest, function(req, res) {
    if (req.query.shop) {
        var params = { 
            client_id: config.oauth.api_key,
            client_secret: config.oauth.client_secret,
            code: req.query.code
        }
        var req_body = querystring.stringify(params);
        console.log(req_body)
        request({
            url: 'https://' + req.query.shop + '/admin/oauth/access_token', 
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(req_body)
            },
            body: req_body
        }, 
        function(err,resp,body) {
            console.log(body);
            body = JSON.parse(body);
            req.session.access_token = body.access_token;
            console.log(req.session);
            res.redirect('/');
        })
    }
})

// Renders the install/login form
app.get('/install', function(req, res) {
    res.render('app_install', {
        title: 'Shopify Embedded App'
    });
})

// Renders content for a modal
app.get('/modal_content', function(req, res) {
    res.render('modal_content', {
        title: 'Embedded App Modal'
    });
})

// The home page, checks if we have the access token, if not we are redirected to the install page
// This check should probably be done on every page, and should be handled by a middleware
app.get('/', function(req, res) {
    if (req.session.access_token) {
          
          request.get({
          url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',
          headers: {
                'X-Shopify-Access-Token': req.session.access_token
            }
        }, 
          function(error, response, body){
            if(error)
                return next(error);
            body = JSON.parse(body);
            if(body.script_tags.length<1){
                 
                   res.render('index', {
                    title: 'Home',
                    api_key: config.oauth.api_key,
                    shop: req.session.shop
                });
            }
            else{
             console.log('in else',body.script_tags.length);

            res.render('response');
            }
            
            // res.render('response');
        })  



        
    } else {
        res.redirect('/install');
    }
})


// app.get('/scripts', function(req, res) {
    
//     request.post({
//         url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',
//         json: {
//             "script_tag": {
//               "event":"onload",
//               "src":"https://73bbebd2.ngrok.io/custom20.js"
//             }
//           },
//         headers: {
//             'X-Shopify-Access-Token': req.session.access_token
//         }
//     }, function(error, response, body){
//         if(error)
//             return next(error);
        
//         res.send(body);
//     })  
// })

app.get('/integrate',function(req,res){
  var getcountry;
  var CountryArray=[];
  var getTax;
   request.get({
       url: 'https://' + req.session.shop + '.myshopify.com/admin/shop.json',
       headers: {
       'X-Shopify-Access-Token': req.session.access_token
            }
},function(error,response,body)
{
    if(error)
    return next(error);
    body = JSON.parse(body);
    getcountry=body.shop.country_name;
    getCurrency=body.shop.money_format;
    getCurrency=getCurrency.replace('{{amount}}','');


    request.post({
        url: 'https://' + req.session.shop + '.myshopify.com/admin/metafields.json',
        json:{
            "metafield": {
              "namespace": "commerce_plugin",
              "key": "vat-currency",
              "value": getCurrency,
              "value_type": "string"
            }
          }
          ,
        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        }
    }, function(error, response, body){
        if(error)
            return next(error);
    })  


    

});

 request.get({
    url: 'https://' + req.session.shop + '.myshopify.com/admin/countries.json',
    headers: {
    'X-Shopify-Access-Token': req.session.access_token
         }
},function(error,response,body)
{
 if(error)
 return next(error);
  body = JSON.parse(body);
  if(body.countries[0].tax){
    //   res.send(body.countries[0].tax);

      getTax= body.countries[0].tax;
      request.post({
        url: 'https://' + req.session.shop + '.myshopify.com/admin/metafields.json',
        json:{
            "metafield": {
              "namespace": "commerce_plugin",
              "key": "vat",
              "value": getTax,
              "value_type": "string"
            }
          }
          ,
        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        }
    }, function(error, response, body){
        if(error)
            return next(error);
        
        
        request.post({
            url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',
            json: {
                "script_tag": {
                  "event":"onload",
                  "src":"https://shopify.vteamslabs.com:3002/vat-updated.js"
                }
              },
            headers: {
                'X-Shopify-Access-Token': req.session.access_token
            }
        }, function(error, response, body){
            if(error)
                return next(error);
            
            res.render('response');
        })  
    })  

  }else{
      res.send("can't get tax rate");
  }

});
});

function verifyRequest(req, res, next) {
    var map = JSON.parse(JSON.stringify(req.query));
    delete map['signature'];
    delete map['hmac'];

    var message = querystring.stringify(map);
    var generated_hash = crypto.createHmac('sha256', config.oauth.client_secret).update(message).digest('hex');
    console.log(generated_hash);
    console.log(req.query.hmac);
    if (generated_hash === req.query.hmac) {
        next();
    } else {
        return res.json(400);
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server_ip_address = 'shopify.vteamslabs.com';
app.set('port', process.env.PORT || 3002);
var server=https.createServer(options, app).listen(app.get('port'),server_ip_address,function(){
console.log('Express server listening on port ' + server.address().port);

});
//var server = app.listen(app.get('port'), server_ip_address, function() {
  //console.log('Express server listening on port ' + server.address().port);
//});

module.exports = app;

