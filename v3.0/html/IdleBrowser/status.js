var start = function(){

	var status = {};
	status = iniciar(status);
	escreverStatus(status);
	
	
	window.addEventListener("beforeunload", function(){
		salvar(status);
	});
	
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
		}else if(key.includes("combate") || key.includes("habilidades")){
			//console.log(status[key]);
			for(var chave in status[key]){
				cap = maiuscula(chave);
				if(chave.includes("exp")){
					var texto = "";
					if(chave.includes("Minerar")) texto = "Minerar";	
					else if(chave.includes("Forjar")) texto = "Forjar";
					else if(chave.includes("Caca")) texto = "Cacar";
					else if(chave.includes("Chefe")) texto = "Chefe";
					else if(chave.includes("Combate")) texto = "Combate";

					var level = "lvl" + texto;
					var experiencia = "exp" + texto; 
					var compExp = (status[key][level] * status[key][level]) * (50 + status[key][level]);
					
					str += " | " + cap + ": " + status[key][chave] + " / " + compExp + " | ";	
				}
				else{
					str += " | " + cap + ": " + status[key][chave] + " | ";
				}
			}
		}else if(key == "tempoJogado") str += " | " + cap + ": " + formatarTotal(status[key]) + " | ";
		else if(key == "tempoInicial" || key == "acao") ;
		else{
			str += " | " + cap + ": " + status[key] + " | ";
		}
		
	}
	
	dados.innerHTML = str;
	
};

