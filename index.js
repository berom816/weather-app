/*use navigation.geolocation to get coordinates of user location, enter that into weather api to get the weather of that coordinates. also since want to display the city and state name, will use google map api*/

//to enable google map getting user location, have to make sure "https:" is typed in front url to ensure security
if(location.protocol=='http:'){
  alert('Please type in \'https://\' in front of URL to ensure security');
}
else{
  //get user coordinates, use result to pass into callback getUserLocationName and getWeather, both requring coordinates
  getUserCoord(getUserLocationName, getWeather);

  /*create toggle for units in temperature*/
  $("#tempC").hide();
  $("#tempF").click(function(){
    document.getElementById("tempF").style.display = "none";
    $("#tempC").show();
  });
  document.getElementById("tempC").onclick = function(){
    $("#tempC").hide();
    $("#tempF").show();
  };
}

/*function for get location of user through navigator.geolocation and put into google map api*/
function getUserCoord(callback1, callback2){
  //navigator is a object from html5' geolocation API,checking if geolocation usage is available
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      //using google map api
      var mapURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long;
      //invoke the two argument function as callback
      callback1(mapURL);
      callback2(lat, long);
    });
  }
}

/*using the coords retrieved, put through google map api to get named location*/
function getUserLocationName(url){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      var response = JSON.parse(this.responseText);
      for(var a = 0; a<response.results.length; a++){
        if(response.results[a].types[0]==='locality' && response.results[a].types[1]==='political'){
          //show the user location 
          document.getElementById("location").innerHTML = response.results[a]["formatted_address"];
        }
      }
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}

/*using the coords retrieved, input into dark sky api to get current temperature, icon and summary*/
function getWeather(holdLat, holdLong){
  var holdSite= "https://api.darksky.net/forecast/20b7fde308762cc3f03bac68dd67e36f/" + holdLat + "," + holdLong;
  var holdSite2 = "https://api.darksky.net/forecast/20b7fde308762cc3f03bac68dd67e36f/" + holdLat + "," + holdLong + "?units=si";
  $.ajax({
    url:holdSite, 
    dataType:"jsonp",
    success:function(result){
      $("#tempF").text(result.currently.temperature + "\u00B0" + "F");
      //weather condition
      $("#summary").text(result.currently.summary);
      //create an animated weather icon
      var wIcon = new Skycons({"color":"white"});
      wIcon.add("weatherIcon", result.currently.icon);
      wIcon.play();
    }
  });
  //created another api call for Celsius temperature
  $.ajax({
    url:holdSite2, 
    dataType:"jsonp",
    success:function(res){
      document.getElementById("tempC").textContent = res.currently.temperature + "\u00B0" + "C";
    }
  })
}