//Use app in strict mode
'use strict';

//Using actions on google library
const {
  dialogflow,
} = require('actions-on-google');

//Using expressjs
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require("request");

const app = dialogflow({debug: true});
var expressApp = express();

var ip_add = "http://192.168.0.105/";
var url;
var color = "black";
var PORT = 9000;



expressApp.use(bodyParser());
expressApp.use(bodyParser.json()); 
expressApp.use(cors());

expressApp.get('/fetch',function(req, res) {
    res.send({color: color})
})

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


expressApp.listen(PORT);
console.log('Listening on port ' + PORT); 

