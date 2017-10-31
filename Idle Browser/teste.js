var start = function(){

	var status = {};
	status = iniciar(status);
	escrever(status);
	
};

var escrever = function(status){

	var dados = document.getElementById("dados");
	dados.innerHTML = "Lvl: " + status.lvl + " Atk: " + status.atk;
	
};

