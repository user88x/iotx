$(function() {
  var UPDATE_INTERVAL = 2;
  $(document).ready(function(){
    setInterval(function() {
        $.ajax({url: "fetch", success: function(result){
          if(result) update_plot(result);
        }});
    },1000*UPDATE_INTERVAL);

  function update_plot(res) {
    document.body.style.backgroundColor = res.color
  }
  
  }); //ready

}) //function
