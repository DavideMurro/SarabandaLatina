
var url_location = window.location; 
var http_https = "https://";
var www = "";


if(url_location.protocol) {
	http_https = url_location.protocol + "//";
}

if(url_location.host.startsWith("www.")) {
	www = "www.";
}

var url = http_https + www + "sarabandalatina.it/";
//var url = http_https + "://192.168.1.1/sarabandalatina/";
//var url_system = "/sdcard/sarabandalatina/";
