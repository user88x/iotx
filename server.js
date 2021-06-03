const express = require('express');

//require('save-svg-as-png');

const app = express();
var PORT = process.env.PORT || 9000;
app.use(express.static(__dirname));

var last_data = [];
var dummy = [{temp:0, time: get_time()}];

app.get('/fetch',function(req, res) {
  if(last_data.length) {
  res.send(last_data)
  }else {
  res.send(dummy)

  }
})

/////app.get('/alien',function(req, res) {
/////  const id = req.query.id;
/////  res.send('Hello alien ' + last_data)
/////})

app.get('/data/:id',function(req, res) {
  const id = req.params.id;
  var id_noise = Math.floor(id) - Math.floor(id) % 2;
  last_data.push({temp: id_noise, time: get_time()});
  res.send(last_data)
})

app.listen(PORT, function(req, res) {
  console.log("Running server on port " +  PORT);
});


function get_time() {
  var dt = new Date();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();
  var time_decimal = h + m/60 + s/3600;
  return time_decimal.toFixed(4);
}
