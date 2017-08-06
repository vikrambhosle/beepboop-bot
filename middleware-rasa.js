'use strict';

let request = require('request');

module.exports = function(config) {
  if (!config) {
    config = {};
  }

  if (!config.rasa_uri) {
    config.rasa_uri = 'http://localhost:5000';
  }

  let middleware = {
    receive: function (bot, message, next) {
      /*eslint-disable */
      let postData = {
        'q': message.text
      };
      /*eslint-enable */

      let requestOptions = {
        url: config.rasa_uri + '/parse',
        body: postData,
        json: true
      };

      request.post(requestOptions, function (error, response, body) {
        // TODO
        // error handling
        if (body) {
          /* There will be only one intent for sentences of any length.
           * Ex query - "Hi. i am arjun. i have 102 fever"
           *
           * Output - {"text": "hi. this is arjun. i have 102 fever",
           *   "confidence": 0.49330375056610876, "intent": "symptom_analyze",
           *    "entities": [{"start": 12, "end": 18, "value": "arjun.",
           *    "entity": "patient_name"}, {"start": 21, "end": 25, "value":
           *    "have", "entity": "symptom"}, {"start": 26, "end": 29,
           *    "value": "102", "entity": "fever_temp"}, {"start": 30,
           *    "end": 35, "value": "fever", "entity": "symptom"}]}
           */
          let intent = body.intent;

          // Group all similar entities in an array.
          let bodyEntities = body.entities;
                 // intent.entities = messageEntities;
          message.intent = intent;
          message.entities = bodyEntities;
        }

        next();
      });
    },
    hears: (patterns, message) => {
      return patterns.some(pattern => {
        
        if (typeof(message.intent) == 'undefined') {
message.intent='greet';
}
        
        if (message.intent.name === pattern) {
          debug('Rasa intent matched hear pattern', message.intent, pattern)
          return true
        }
      })
}
  };

  return middleware;
};
