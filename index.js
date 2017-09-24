var config = require('./config.json');
var Botkit = require('botkit')
var _ = require('underscore');
var pg =require('pg')
var tools = require('./compound.js')
var rasa = require('./middleware-rasa.js')({rasa_uri: 'http://localhost:5000'});
const connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
const client = new pg.Client(connectionString);
client.connect();

//process.env.token = config.token;
//process.env.clientId = config.clientId;
var clientsecret = process.env.CLIENT_SECRET;
console.log('lk'+clientsecret)
process.env.port = config.port;

if (!process.env.clientId || !clientsecret || !process.env.port) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}

//var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  interactive_replies: true,
  debug: false
}).configureSlackApp(
  {
    clientId: process.env.clientId,
    clientSecret:clientsecret,
    // Set scopes as needed. https://api.slack.com/docs/oauth-scopes
    scopes: ['bot','incoming-webhook','team:read','users:read','users.profile:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot'],
  }
);

controller.setupWebserver(process.env.port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});


controller.middleware.receive.use(rasa.receive);
/* Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })*/
// Otherwise assume multi-team mode - setup beep boop resourcer connection
/*} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}*/

/*controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})
controller.hears(['hi'], ['ambient', 'direct_message','direct_mention','mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})*/

/*controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "Hey , how can I help you today ?")
})*/

controller.on('create_bot',function(bot,config) {
  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {
      if (!err) {
        trackBot(bot);
      }
      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });
    });
  }
});

var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.hears(['create_wp'],'direct_message,direct_mention,mention', rasa.hears, function(bot, message) {
      var user = message.user;
    var today = new Date();
    var dd = today.getDate();
    var wpdesc=" "
    var wpjira=" " 
    var wphc =" "
    var wpamount =" " 
    var wpstdate =" "
    var wpenddate =" "
     var wpstatus =" "
    var bcontact =" "
    var ibmcontact=" "
    var wpc =" "

    var obj=tools.composite(message.entities)
    if (_.size(obj)>1)
    {
   var jsonArr = [];   
   for (var i = 0; i < obj.length; i++) {
     if(obj[i].duckling_value==""){ var vtex= obj[i].value } else {var vtex= obj[i].duckling_value }
     jsonArr.push({
        
                        fallback: "fallback text",
                        callback_id: '123',
                        attachment_type: 'default',
                        title: obj[i].entity,
                        text: vtex ,
                        color: '#0075C7',
                        actions: [
                            {
                              "name": "button name",
                              "text": "Delete",
                              "type": "button",
                              "value": "delete"}
                        ]
    });
}
      
      var testButtonReply = {
                username: 'resourceguru' ,
                text: ' If i got something wrong , you can delete it !',
                replace_original: 'true',
                attachments: jsonArr ,
                icon_url: 'http://14379-presscdn-0-86.pagely.netdna-cdn.com/wp-content/uploads/2014/05/ButtonButton.jpg'
                
            }
    bot.reply(message, testButtonReply);            
    }

  
  
  
  /*  bot.createConversation(message,function(err,onvo) {

        
    onvo.addQuestion('Give me a short description of the Work Package scope',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
           console.log('check1'+JSON.stringify(response.entities))
           console.log('check2'+JSON.stringify(response.entities))
           console.log('dekho'+JSON.stringify(tools.composite(response.entities)))
          console.log('PIntent:', response.intent, response.intent.name);
          if(response.intent.name=='dont_know' && parseFloat(response.intent.confidence)>0.40) {
          onvo.say('I need a description to proceed');
          onvo.repeat();
          onvo.next();
          }
          else{
          
         wpdesc= response.text  
          console.log('yoyo',wpdesc)
          onvo.gotoThread('wpjira')
          }
              } }],{},'default');
    
         onvo.addQuestion('Whats the JIRA Reference?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          
         
          console.log('Intent:', response.intent, response.intent.name);
          if(response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
          onvo.transitionTo('wpheadcount','No problem.Ill ask you later');
        
                    }
          else{
               wpjira = response.text  
               onvo.gotoThread('wpheadcount')
          }
              } }],{},'wpjira');
    
    
       onvo.addQuestion('What is the headcount expected?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
          onvo.transitionTo('wpamount','No problem.Ill ask you later');
          }
          else {
         
          wphc = response.text 
           onvo.gotoThread('wpamount')}
              } }],{},'wpheadcount');
    
       onvo.addQuestion('What is the Work package amount ?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
         
         onvo.transitionTo('wpstdate','No problem.Ill ask you later');
             }
          else{
           wpamount = response.text  
          onvo.gotoThread('wpstdate')}
          
              } }],{},'wpamount');
      
        onvo.addQuestion('What is the Start Date?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
       onvo.transitionTo('wpenddate','No problem.Ill ask you later');
          }
          else {
        wpstdate = response.text  
           onvo.gotoThread('wpenddate')}
              } }],{},'wpstdate');
    
            onvo.addQuestion('What is the End Date?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
       onvo.transitionTo('signed','No problem.Ill ask you later');
                       
          }
          else {
           wpenddate = response.text  
           onvo.gotoThread('signed')}
              } }],{},'wpenddate');
      
                onvo.addQuestion('Is this signed already?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
     onvo.transitionTo('bcontact','No problem.Ill ask you later');
          }
          else {
           wpstatus = response.text  
           onvo.gotoThread('bcontact')
          }
              } }],{},'signed');
      
       onvo.addQuestion('Who is the Barclays Contact?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
          onvo.transitionTo('ibmcontact','Ill ask you later');
          }
          else {
           bcontact = response.text  
           onvo.gotoThread('ibmcontact')
          }
              } }],{},'bcontact');
      
         onvo.addQuestion('Who is the IBM Contact?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know'&& parseFloat(response.intent.confidence)>0.40) {
         onvo.transitionTo('closing','OK.Ill ask you later');
            
          }
          else{
        ibmcontact = response.text  
          onvo.gotoThread('closing');
          }
              } }],{},'ibmcontact');
    
    
   onvo.beforeThread('closing', function(onvo, next) {
   //wpjira,wpdesc,wphc,wpamount,wpstdate,wpenddate,wpstatus,bcontact,ibmcontact,dd,user
     client.query('INSERT INTO workpackage(ContractId,JiraRef,Description,StartDate,EndDate,Headcount,WPAmount,Status,SubmittedOn,BarclaysContact,IBMContact,	LastUpdateDate,UserName) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)RETURNING wpid;',
                ['TEST',wpjira.toString(),wpdesc.toString(),wpstdate.toString(), wpenddate.toString(),wphc.toString(),wpamount.toString(),wpstatus.toString(),dd.toString(),bcontact.toString(),ibmcontact.toString(),dd.toString(),user.toString()],
                function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                   wpc=result.rows[0].wpid
                   onvo.setVar=('wpc', wpc)
                    console.log('row inserted with id: ' + result.rows[0].wpid)
                  console.log('row inserted with id: ' + wpc);
                }});

     console.log('jira:',wpjira)
     
    // client.query("INSERT INTO workpackage(ContractId,JiraRef,Description) values('test',wpjira,wpdesc);");
     
     next()
 /*    // do something complex here
      myFakeFunction(name).then(function(results) {
  
    convo.setVar('results',results);
    // call next to continue to the secondary thread...
    next();
  }).catch(function(err) {
    convo.setVar('error', err);
    convo.gotoThread('error');
    next(err); // pass an error because we changed threads again during this transition
  });
});
    
    console.log("wpc==",wpc);
    onvo.addMessage( 'I have created the work package '+ wpc,'closing');
    
      onvo.next()
    
      onvo.activate()
         }) */

});

controller.hears(['greet'],'direct_message,direct_mention,mention', rasa.hears, function(bot, message) {
    bot.reply(message, 'Hello. How can I help you ?')
   console.log('Intent:', message.intent);
    console.log('Entities:', message.entities);  
    //client.query('INSERT INTO items(text) values($1)',[message.intent.name]);
  
});
