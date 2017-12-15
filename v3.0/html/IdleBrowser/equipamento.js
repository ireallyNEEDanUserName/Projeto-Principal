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

	var status = iniciar(status);
	
	if(status.equipamentos[tipo] != "") status = removerItemAtr(status.equipamentos[tipo], status);
	if(item != "#")	status = atributos(item, status);
	else item = "";
	
	//console.log("Antes: " + status.equipamentos[tipo]);
	if(status.equipamentos[tipo] in status.inventario) status.inventario[status.equipamentos[tipo]] += 1;
	else{
		status.inventario[status.equipamentos[tipo]] = 0;
		status.inventario[status.equipamentos[tipo]] += 1;
	}
	
	status.equipamentos[tipo] = item;
	if(item != "") status.inventario[item] -= 1;
	
	//console.log("Depois: " + status.equipamentos[tipo]);
	
	textoFinalPagina("Atk: " + status.combate.atk + " | Vel: " + status.combate.vel + " | Precisao: " + status.combate.precisao);
	
	salvar(status);
	
};

var atributos = function(item, status){
		
	var refino = verificarRefino(item);
	if(refino[0] != "")	var lvlRef = parseInt(refino[0]);
	else var lvlRef = 0;
	
	var iten = verificarItem(minuscula(item));
	
	for(var key in iten.estatisticas){
		if(key != "precisao") status.combate[key] = status.combate[key] + (iten.estatisticas[key] + (lvlRef * iten.lvl));
		else status.combate[key] = status.combate[key] + (iten.estatisticas[key] + Math.floor((iten.lvl * lvlRef) / 10));
	}
	
	return status;
};

var removerItemAtr = function(itemAnterior, status){
	
	var refino = verificarRefino(itemAnterior);
	if(refino[0] != "")	var lvlRef = parseInt(refino[0]);
	else var lvlRef = 0;
	console.log(refino);
	
	var iten = verificarItem(minuscula(itemAnterior));
	
	for(var key in iten.estatisticas){
		if(key != "precisao") var soma = (iten.estatisticas[key] + (lvlRef * iten.lvl));
		else var soma = (iten.estatisticas[key] + Math.floor((iten.lvl * lvlRef) / 10));
		console.log(key + " :> " + soma);
		status.combate[key] -= soma;
	}
	
	return status;
}