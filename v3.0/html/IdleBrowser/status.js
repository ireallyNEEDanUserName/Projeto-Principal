var start = function(){

	var status = {};
	status = iniciar(status);
	escreverStatus(status);
	
	window.addEventListener("beforeunload", function(){
		localStorage.setItem("Jogador", JSON.stringify(status));
	});
	
};

var escreverStatus = function(status){

	var dados = document.getElementById("dados");
	
	var str = "";
	var cap = "";
	var tam = 0;
	for(var key in status){
		if(key == 'inventario'){
			for(var chave in status[key]) tam += status[key][chave];			
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + tam + " | ";
		}else if(key == 'empregados'){
			tam = Object.keys(status[key]).length;
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + tam + " | ";
		}else if(key.includes("exp")){
		
			var texto = "";
			if(key.includes("Minerar")) texto = "Minerar";	
			else if(key.includes("Forjar")) texto = "Forjar";
			else if(key.includes("Caca")) texto = "Cacar";
			else if(key.includes("Chefe")) texto = "Chefe";

			var level = "lvl" + texto;
			var experiencia = "exp" + texto; 
			var compExp = (status[level] * status[level]) * (50 + status[level]);
			
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + status[key] + " / " + compExp + " | ";
		}else{
			cap = key.charAt(0).toUpperCase() + key.slice(1);
			str += " | " + cap + ": " + status[key] + " | ";
		}
	}
	
	dados.innerHTML = str;
	
};

