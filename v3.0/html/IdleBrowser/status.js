var start = function(){

	var status = {};
	status = iniciar(status);
	escreverStatus(status);
	
};

var escreverStatus = function(status){

	var dados = document.getElementById("dados");
	
	var str = "";
	var cap = "";
	var tam = 0;
	for(var key in status){
		cap = maiuscula(key);
		if(key == 'inventario'){
			for(var chave in status[key]) tam += status[key][chave];			
			str += " | " + cap + ": " + tam + " | ";
		}else if(key == 'empregados'){
			tam = Object.keys(status[key]).length;
			str += " | " + cap + ": " + tam + " | ";
		}else if(key.includes("exp")){
			var texto = "";
			if(key.includes("Minerar")) texto = "Minerar";	
			else if(key.includes("Forjar")) texto = "Forjar";
			else if(key.includes("Caca")) texto = "Cacar";
			else if(key.includes("Chefe")) texto = "Chefe";
			else if(key.includes("Combate")) texto = "Combate";

			var level = "lvl" + texto;
			var experiencia = "exp" + texto; 
			var compExp = (status[level] * status[level]) * (50 + status[level]);
			
			str += " | " + cap + ": " + status[key] + " / " + compExp + " | ";	
		}else if(key.includes("combate") || key.includes("habilidades")){
			console.log(status[key]);
		}else{
			str += " | " + cap + ": " + status[key] + " | ";
		}
		
	}
	
	dados.innerHTML = str;
	
};

