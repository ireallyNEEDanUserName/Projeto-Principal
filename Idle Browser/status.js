var start = function(){

	var status = {};
	status = iniciar(status);
	escrever(status);
	
	window.addEventListener("beforeunload", function(){
		localStorage.setItem("Jogador", JSON.stringify(status));
	});
	
};

var escrever = function(status){

	var dados = document.getElementById("dados");
	
	var str = "";
	var cap = "";
	var tam = 0;
	for(var key in status){
		if(key == 'inventario'){
			for(var chave in status[key]) tam += status[key][chave];			
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + tam + " | ";
		}else{
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + status[key] + " | ";
		}
	}
	
	dados.innerHTML = str;
	
};

