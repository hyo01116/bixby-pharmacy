var console = require('console');
var http = require('http');
var config = require('config');
function makeURL(t, a, b){
  let url = '';
  const baseURL = config.get("pharmacyURL");
  const key = secret.get("key");
  url = baseURL+'WGS84_LON=' + a +'&WGS84_LAT=' + b + '&pageNo='+t+'&ServiceKey='+key;
  
  return url;
}
function getdistance(lat1, lon1, lat2, lon2){
  const dLat = Math.abs(lat1 - lat2);
  const dLon = Math.abs(lon1 - lon2);
  const a = dLat + dLon;
  
  return a;
}
function check(near){
  if((near == "약국"))
    return true;
  else
    return false;
}
module.exports.function = function findnearPharmacy (near, point) {
  console.log(near);
  console.log(point);
  pharmacyinfo = [];

  let url = '';
  var max_distance =5;
  if(check(near)){
    for(var t = 1; t<=10; t++){
      url = makeURL(t, point.point.longitude, point.point.latitude);
      var urlResponse = http.getUrl(url, {format : "xmljs"});
      var items = urlResponse.response.body.items;
      var item = items.item;
      if(item == null){
        break;
      }
      for(var i = 0; i<item.length; i++){
        distance = getdistance(point.point.latitude, point.point.longitude, item[i].latitude, item[i].longitude);
        if(distance < max_distance){
          max_distance = distance;
          var address = item[i].dutyAddr;
          var name = item[i].dutyName;
          var tel = item[i].dutyTel1;
        }
      }
    }
    pharmacyinfo.push(address);
    pharmacyinfo.push(name, tel)
  }
  return pharmacyinfo
}
