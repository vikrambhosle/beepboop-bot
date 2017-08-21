var _ = require('underscore');

/*var stru= '[{	"id": 100,	"title": "Tlt1",	"tax": [{		"name": "Tax1",		"id": 15	}, {		"name": "Tax1",		"id": 17	}]}, {	"id": 101,	"title": "Tlt2",	"tax": [{		"name": "Tax2",		"id": 16	}]}, {	"id": 102,	"title": "Tlt3",	"tax": [{		"name": "Tax3",		"id": 17	}, {		"name": "Tax3",		"id": 18	}]}]'
var obju = JSON.parse(stru);*/

var str = '{"model": "default", "time": "2017-08-19T13:09:40.445117", "user_input": {"entities": [{"end": 51, "entity": "headcount", "extractor": "ner_crf", "start": 45, "value": "12 dec"}, {"end": 72, "entity": "amount", "extractor": "ner_crf", "start": 61, "value": "4000 pounds"}, {"additional_info": {"value": 12.0}, "end": 47, "entity": "number", "extractor": "ner_duckling", "start": 45, "text": "12", "value": 12.0}, {"additional_info": {"value": 2018.0}, "end": 56, "entity": "number", "extractor": "ner_duckling", "start": 52, "text": "2018", "value": 2018.0}, {"additional_info": {"value": 4000.0}, "end": 65, "entity": "number", "extractor": "ner_duckling", "start": 61, "text": "4000", "value": 4000.0}, {"additional_info": {"unit": "\u00a3", "value": 4000.0}, "end": 72, "entity": "amount-of-money", "extractor": "ner_duckling", "start": 61, "text": "4000 pounds", "value": 4000.0}, {"additional_info": {"unit": null, "value": 12.0}, "end": 47, "entity": "distance", "extractor": "ner_duckling", "start": 45, "text": "12", "value": 12.0}, {"additional_info": {"unit": null, "value": 2018.0}, "end": 56, "entity": "distance", "extractor": "ner_duckling", "start": 52, "text": "2018", "value": 2018.0}, {"additional_info": {"unit": null, "value": 4000.0}, "end": 65, "entity": "distance", "extractor": "ner_duckling", "start": 61, "text": "4000", "value": 4000.0}, {"additional_info": {"latent": true, "unit": null, "value": 12.0}, "end": 47, "entity": "volume", "extractor": "ner_duckling", "start": 45, "text": "12", "value": 12.0}, {"additional_info": {"latent": true, "unit": null, "value": 2018.0}, "end": 56, "entity": "volume", "extractor": "ner_duckling", "start": 52, "text": "2018", "value": 2018.0}, {"additional_info": {"latent": true, "unit": null, "value": 4000.0}, "end": 65, "entity": "volume", "extractor": "ner_duckling", "start": 61, "text": "4000", "value": 4000.0}, {"additional_info": {"unit": null, "value": 12.0}, "end": 47, "entity": "temperature", "extractor": "ner_duckling", "start": 45, "text": "12", "value": 12.0}, {"additional_info": {"unit": null, "value": 2018.0}, "end": 56, "entity": "temperature", "extractor": "ner_duckling", "start": 52, "text": "2018", "value": 2018.0}, {"additional_info": {"unit": null, "value": 4000.0}, "end": 65, "entity": "temperature", "extractor": "ner_duckling", "start": 61, "text": "4000", "value": 4000.0}, {"additional_info": {"grain": "year", "others": [{"grain": "year", "value": "4000-01-01T00:00:00.000Z"}], "value": "4000-01-01T00:00:00.000Z"}, "end": 65, "entity": "time", "extractor": "ner_duckling", "start": 61, "text": "4000", "value": "4000-01-01T00:00:00.000Z"}, {"additional_info": {"grain": "day", "others": [{"grain": "day", "value": "2018-12-12T00:00:00.000Z"}], "value": "2018-12-12T00:00:00.000Z"}, "end": 56, "entity": "time", "extractor": "ner_duckling", "start": 45, "text": "12 dec 2018", "value": "2018-12-12T00:00:00.000Z"}], "intent": {"confidence": 0.8052340502832008, "name": "create_wp"}, "intent_ranking": [{"confidence": 0.8052340502832008, "name": "create_wp"}, {"confidence": 0.07587500737044468, "name": "device_failure"}, {"confidence": 0.0658988174685606, "name": "dont_know"}, {"confidence": 0.05299212487779405, "name": "greet"}], "text": "I have a new work packag from Pavan starting 12 dec 2018 for 4000 pounds"}}'
var obj = JSON.parse(str).user_input.entities;
var srch =JSON.parse(str).user_input.entities.additional_info;
    
/*var filtered = _.filter(obju, function(a){
return _.some(a.tax,function(b){
    return b.id==15})})*/

var filter_ent = _.filter(obj, function(n){
    return  n.extractor=="ner_crf"})
/*
console.log(JSON.stringify(filtered))
console.log(JSON.stringify(filtereda))
console.log(JSON.stringify(filtereda[1]))
*/
for(var i = 0; i < filter_ent.length; i++) {
    var start = filter_ent[i].start;
    var end = filter_ent[i].end

    var filter_srch = _.filter(srch, function(x){
    return  x.start.toInt >=start && x.end.toInt >=end})
    
    
    console.log(filter_ent);
    console.log(filter_srch);
}


/*_.filter(data.grouplist, function(n){ 
    return _.some(n.optionlist, function(option){ 
        return option.optionitem == "red";
    });
 });*/

