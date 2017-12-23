var impInv = function(){

	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);
	
	var ult = document.getElementById('Menu');
	
	console.log(status.inventario);
	
	var div = "<div id='inventario'>";
	
	for(var key in itens){
		var h2 = key;
		if(key == "caca") h2 = "caça";
		div += "<h2>" + maiuscula(h2) + "</h2>";
		div += "<p>";
		for(var chave in itens[key]){		
			if(maiuscula(chave) in status.inventario) div += maiuscula(chave) + " : " + status.inventario[maiuscula(chave)] + " | ";	
		}
		div += " </p>";
	}
	
	for(var chave in itens.forja){
		div += "<h3>" + maiuscula(chave) + "</h3><p>";
		for(var key in status.inventario){
			if(key.includes(maiuscula(chave))){
				if(status.inventario[key] <= 0 || key.includes("+0")) delete status.inventario[key]; //Deleta os itens +0, somente item normal e +1 depois do primeiro refino.
				else{
					item = verificarItem(minuscula(key));
					try{
						if(item.tipo == "forjar"){
							div += key + " : " + status.inventario[key] + " | ";
						}
					}catch(err){
						console.log("Erro na pagina inventario.js na linha 31 - " + err);
					}
				}
			}
		}
		div += " </p>";
	}
	
	
	div += "</div>";
	
	ult.insertAdjacentHTML('afterend', div);
	
	
	window.addEventListener("beforeunload", function(){
		salvar(status);
	});
}
