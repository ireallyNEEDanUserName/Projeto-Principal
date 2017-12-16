var iniciarEquip = function(){

	var status = iniciar(status);
	//console.log(status.equipamentos);
	
	var itens = {};
	itens = defItens(itens);
	//console.log(itens.forja);
	
	div = "";
	for(var key in status.equipamentos){
		div += "<div id='" + key + "Equip' class='Equip'><i>" + maiuscula(key) + " : </i>"
		div += option(key, itens, status);
		div+= "</div>";
	}
	
	var menu = document.getElementById("Menu");
	menu.insertAdjacentHTML('afterEnd', div);
	

};


var option = function(key, itens, status){

	var div = "";
	
	if(status.equipamentos[key] == "") var inicial = "#";
	else var inicial = status.equipamentos[key];
	
	div = "<select id='Select" + key + "Equip' value='" + key + "'>";
	div += "<option value='" + inicial + "'>" + status.equipamentos[key] + "</option>";
	if(inicial != "#"){
		div += "<option value='#'> </option>";
	}
	
	for(var inv in status.inventario){
		if(inv.includes(maiuscula(key))){
			div += "<option value='" + inv + "' class='infEquip'>" + inv + "</option>";
		}
	}
	
	div += "</select>  ";
	div += "<button id='" + key + "Equip' class='ButtonEquip'> Equipar </button>  ";
	//div += "<button id='" + key + "Equip' class='ButtonDesequipar'> Desequipar </button>";
	
	return div;
};


var equipar = function(item, tipo){
	
	console.log(item);
	var status = iniciar(status);
	
	if(item == "#") item = "";
	
	//console.log("Antes: " + status.equipamentos[tipo]);
	if(item != ""){
		if(status.equipamentos[tipo] in status.inventario) status.inventario[status.equipamentos[tipo]] += 1;
		else{
			status.inventario[status.equipamentos[tipo]] = 0;
			status.inventario[status.equipamentos[tipo]] += 1;
		}
	}
	
	status.equipamentos[tipo] = item;
	if(item != "#" && item != "") status.inventario[item] -= 1;
	
	//console.log("Depois: " + status.equipamentos[tipo]);
	
	if(status.equipamentos[tipo] != "" || item != "#") status = atributos(item, status);
	
	var textAtr = "";
	for(var atr in status.combate){
		if(!(atr.includes("Base")) && !(atr.includes("lvl")) && !(atr.includes("exp")) && !(atr.includes("ontos"))) textAtr += " " + maiuscula(atr) + " : " + status.combate[atr];
	}
	textoFinalPagina(textAtr);
	
	salvar(status);
	
};

var atributos = function(item, status){
	
	var valor = {};
	for(var atr in status.combate){
		if(!(atr.includes("Base")) && !(atr.includes("lvl")) && !(atr.includes("exp")) && !(atr.includes("ontos"))) valor[atr] = 0;
	}
	
	for(var chave in status.equipamentos){
		if(status.equipamentos[chave] != ""){
			var refino = verificarRefino(status.equipamentos[chave]);
			if(refino[0] != "") var lvlRef = parseInt(refino[0]);
			else var lvlRef = 0;
			
			var iten = verificarItem(minuscula(status.equipamentos[chave]));
			
			for(var key in iten.estatisticas){
				if(key != "precisao") valor[key] += (iten.estatisticas[key] + (lvlRef * iten.lvl));
				else valor[key] += (iten.estatisticas[key] + Math.floor((iten.lvl * lvlRef) / 10));
			}
		}
	}
	
	console.log(valor);
	
	for(var atr in status.combate){
		if(!(atr.includes("Base")) && !(atr.includes("lvl")) && !(atr.includes("exp")) && !(atr.includes("ontos"))){
			console.log(atr + " > " + valor[atr]);
			status.combate[atr] = status.combate[atr + "Base"] + status.combate[atr + "Pontos"] + valor[atr];
		}
	}
	
	console.log(status.combate);
	return status;
};
