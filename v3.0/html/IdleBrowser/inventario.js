var impInv = function(){

	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);
	
	var ult = document.getElementById('barraInvt');
	
	console.log(status.inventario);
	
	var div = "<div id='inventario'>";
	
	for(key in itens){
		div += "<h3>" + key + "</h3>";
		for(chave in itens[key]){
			if(maiuscula(chave) in status.inventario) div += "<p>" + maiuscula(chave) + " : " + status.inventario[maiuscula(chave)]  + " </p>";
		}
	}
	
	for(var key in status.inventario){
	
		if(status.inventario[key] == 0) delete status.inventario[key];
		else{
			item = verificarItem(minuscula(key));
			try{
				if(item.tipo == "forjar"){
					div += "<p>" + key + " : " + status.inventario[key]  + " </p>";
				}
			}catch(err){
				console.log("Erro na pagina inventario.js na linha 31 - " + err);
			}
		}
	}
	
	div += "</div>";
	
	ult.insertAdjacentHTML('beforeend', div);
	
	
	window.addEventListener("beforeunload", function(){
		salvar(status);
	});
}
