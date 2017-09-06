var achar = function(texto){
	var ultimo = 0;
	for(var x = 0; x < texto.length; x++){
		if("/" == texto[x]) ultimo = x;
	}
	return ultimo + 1;
}


var userAgent = navigator.userAgent.toLowerCase();
var devices = new Array('nokia','iphone','blackberry','sony','lg',
	'htc_tattoo','samsung','symbian','SymbianOS','elaine','palm',
	'series60','windows ce','android','obigo','netfront',
	'openwave','mobilexplorer','operamini');

function mobiDetect(userAgent, devices) {
	for(var i = 0; i < devices.length; i++) {
		if (userAgent.search(devices[i]) > 0) {
			return true;
		}
	}
	return false;
}
if (mobiDetect(userAgent, devices)) {
	if(!window.location.href.includes("m.")){
		var url_redirect = "m." + window.location.pathname.slice(achar(window.location.pathname));
		//console.log(url_redirect);
		window.location.href = url_redirect;
	}
}

