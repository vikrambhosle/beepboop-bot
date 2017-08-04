var Botkit = require('botkit')
let rasa = require('./botkit-rasa-middleware')({rasa_uri: 'http://localhost:5000'});
var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

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

// Override receive method in botkit
controller.middleware.receive.use(rasa.receive);

// Override hears method in botkit
controller.changeEars(function (patterns, message) {
  return rasa.hears(patterns, message);
});

controller.setupWebserver(3000, function (err, webserver) {
  // Configure a route to receive webhooks from slack
  controller.createWebhookEndpoints(webserver);
});

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hi'], ['ambient', 'direct_message','direct_mention','mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})
