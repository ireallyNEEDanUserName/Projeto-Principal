var achar = function(texto){
	var ultimo = 0;
	for(var x = 0; x < texto.length; x++){
		if("/" == texto[x]) ultimo = x;
	}
	//console.log(ultimo);
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

	//console.log(window.location.pathname[achar(window.location.pathname)] + " : " + window.location.pathname);

	if(!window.location.href.includes("m.")){
		if(window.location.pathname[achar(window.location.pathname)] != undefined){
			var url_redirect = "m." + window.location.pathname.slice(achar(window.location.pathname));
		}
		else var url_redirect = "m.index.html";
		
		
		console.log(url_redirect);
		window.location.href = url_redirect;
	}
}

