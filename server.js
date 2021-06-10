//Use app in strict mode
'use strict';
//Using actions on google library
const {
  dialogflow,
} = require('actions-on-google');

const express = require('express');

var bodyParser = require('body-parser');
var cors = require('cors');
var request = require("request");

const app = dialogflow({debug: true});
const expressApp = express();
expressApp.use(express.static(__dirname));

var ip_add = "http://192.168.0.105/";
var url;
var color = "black";
var temperature = 23;
var PORT = process.env.PORT || 9000;

expressApp.use(bodyParser());
expressApp.use(bodyParser.json()); 
expressApp.use(cors());

var PAUSE = false;
var last_data = [];
var dummy = [{temp:0, time: get_time()},{temp:0, time: get_time()*1 + 10}];
expressApp.post('/fulfillment', app);

app.intent('devicecontrol', (conv,{devicename,devicestatus}) => {
    // speech = "I got "+lednumber+" and "+status;
    var device_name = devicename;
    var device_status = devicestatus;
    color = device_status;
     if(device_name == "fan" && device_status == "on"){
         url = "D0/1";
     }
     else if(device_name == "fan" && device_status == "off"){
         url = "D0/0";
     }
     else if(device_name == "light" && device_status == "on"){
         url = "D1/1";
     }
     else if(device_name == "light" && device_status == "off"){
         url = "D1/0";
     }
     else{
        // conv.ask("Inputs not clear. Please renter your input.");
     }
    return new Promise((resolve, reject) => {
        var options = { 
            method: 'GET',
            url: ip_add+url,
            headers: 
            { 
                'cache-control': 'no-cache'
            } 
        };
    
            if (0) {
                reject(conv.ask("I am not able to process it."));
            }
            else{
                resolve(conv.ask("Turned "+device_status+ " "+device_name));
            }
           
  });
});
app.intent('readsensor', (conv,{devicename}) => {
    // speech = "I got "+lednumber+" and "+status;
    var device_name = devicename;
    return new Promise((resolve, reject) => {
        var options = { 
            method: 'GET',
            url: ip_add+'A0',
            headers: 
            { 
                'cache-control': 'no-cache'
            } 
        };
    
            if (0) {
                reject(conv.ask("I am not able to process it."));
            }
            else{
                var sensor_data = temperature ;
                resolve(conv.ask(device_name +" value is " +sensor_data));
            }
           
  });
});


expressApp.get('/fetch',function(req, res) {
  if(last_data.length) {
    res.send(last_data)
  }else {
    res.send(dummy)
  }
})
expressApp.get('/fetchcolor',function(req, res) {
    res.send(color)
})

expressApp.get('/clear',function(req, res) {
  last_data = [];
})
expressApp.get('/pause',function(req, res) {
  PAUSE = !PAUSE;
})

expressApp.get('/data/:id',function(req, res) {
  if(!PAUSE) {
    const id = req.params.id;
    var id_noise = Math.floor(id) - Math.floor(id) % 2;
    last_data.push({temp: id_noise, time: get_time()});
    res.send(last_data)
  }else {
    res.send("Monitoring paused!")
  }
})

expressApp.listen(PORT, function(req, res) {
  console.log("Running server on port " +  PORT);
});


expressApp.listen(PORT);
console.log('Listening on port ' + PORT); 
function get_time() {
  var dt = new Date();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();
  var time_decimal = (h+5 + (m+30)/60 + s/3600) % 24;
  return time_decimal.toFixed(4);
}
