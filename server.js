const express = require('express');
const app = express();

app.use(express.static(__dirname));

var PORT = process.env.PORT || 9000;
var PAUSE = false;
var last_data = [];
var dummy = [{temp:0, time: get_time()},{temp:0, time: get_time()*1 + 10}];

app.post('/whhandler',function(req, res) {
  console.log(keys(req));
  last_data.push(keys(req))
  if(last_data.length) {
    res.send(last_data)
  }else {
    res.send(dummy)
  }
})
app.get('/fetch',function(req, res) {
  if(last_data.length) {
    res.send(last_data)
  }else {
    res.send(dummy)
  }
})

app.get('/clear',function(req, res) {
  last_data = [];
})
app.get('/pause',function(req, res) {
  PAUSE = !PAUSE;
})

app.get('/data/:id',function(req, res) {
  if(!PAUSE) {
    const id = req.params.id;
    var id_noise = Math.floor(id) - Math.floor(id) % 2;
    last_data.push({temp: id_noise, time: get_time()});
    res.send(last_data)
  }else {
    res.send("Monitoring paused!")
  }
})

app.listen(PORT, function(req, res) {
  console.log("Running server on port " +  PORT);
});


function get_time() {
  var dt = new Date();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();
  var time_decimal = (h+5 + (m+30)/60 + s/3600) % 24;
  return time_decimal.toFixed(4);
}
