var start = function(){

	var status = {};
	status = iniciar(status);
	escrever(status);
	
};

var escrever = function(status){

	var dados = document.getElementById("dados");
	
	var str = "";
	var cap = "";
	for(var key in status){
		cap = key.charAt(0).toUpperCase() + key.slice(1);
		str += " | " + cap + ": " + status[key] + " | ";
	}
	
	dados.innerHTML = str;
	
};

