var Botkit = require('botkit')
var pg =require('pg')
var rasa = require('./middleware-rasa.js')({rasa_uri: 'http://localhost:5000'});
const connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
const client = new pg.Client(connectionString);
client.connect();

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

controller.middleware.receive.use(rasa.receive);
// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

/*controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hi'], ['ambient', 'direct_message','direct_mention','mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})*/

/*controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "Hey , how can I help you today ?")
})*/
controller.hears(['create_wp'],'direct_message,direct_mention,mention', rasa.hears, function(bot, message) {
  bot.startConversation(message,function(err,onvo) {
    onvo.addQuestion('Give me a short description of the Work Package scope',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
          onvo.say('I need a description to proceed');
          onvo.next();
          onvo.repeat();
          }
          
          onvo.gotoThread('wpjira')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the questionothrea
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'default');
    
         onvo.addQuestion('Whats the JIRA Reference?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
          onvo.say('Ill ask you later');
          onvo.next();
          onvo.repeat();
          }
           onvo.gotoThread('wpheadcount')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'wpjira');
    
    
       onvo.addQuestion('What is the headcount expected?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
          onvo.say('OK . Ill ask you later');
            
          }
          
           onvo.gotoThread('wpamount')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'wpheadcount');
    
                  onvo.addQuestion('What is the Work package amount ?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
             }
           onvo.gotoThread('wpstdate')
          
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'wpamount');
      
        onvo.addQuestion('What is the Start Date?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
            
          }
           onvo.gotoThread('wpenddate')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'wpstdate');
    
            onvo.addQuestion('What is the End Date?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
            
          }
           onvo.gotoThread('signed')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'wpenddate');
      
                onvo.addQuestion('Is this signed already?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
            
          }
           onvo.gotoThread('bcontact')
         
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'signed');
      
                      onvo.addQuestion('Who is the Barclays Contact?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
            
          }
          onvo.gotoThread('ibmcontact')
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'bcontact');
      
         })


                      onvo.addQuestion('Who is the IBM Contact?',[
      {
        pattern: ['.'],
        callback: function(response,onvo) {
          console.log('Intent:', response.intent);
          if( response.intent.name=='dont_know') {
         onvo.say('OK . Ill ask you later');
            
          }
          
          onvo.say('Thanks . I have created the Work package.');
          
              } },
         {
        default: true,
        callback: function(response,onvo) {
          // just repeat the question
          onvo.repeat();
          onvo.next();
        }
      }
    ],{},'ibmcontact');
      
         })

});

controller.hears(['greet'],'direct_message,direct_mention,mention', rasa.hears, function(bot, message) {
    bot.reply(message, 'Hello. How can I help you ?')
   console.log('Intent:', message.intent);
    console.log('Entities:', message.entities);  
    client.query('INSERT INTO items(text) values($1)',[message.intent.name]);
 
});
