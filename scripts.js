$(function() {
  var UPDATE_INTERVAL = 2;
  $(document).ready(function(){
    setInterval(function() {
        $.ajax({url: "fetch", success: function(result){
          if(result) update_plot(result);
        }});
    },1000*UPDATE_INTERVAL);

  function update_plot(res) {
    var co = res.color;
    if(co == "read") {co = "red"}
    if(co == "off") {co = "black"}
    if(co == "on") {co = "white"}

    document.body.style.backgroundColor = res.color
  }
  
  }); //ready

}) //function
