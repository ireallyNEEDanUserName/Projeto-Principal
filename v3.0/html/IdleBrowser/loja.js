var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(tipo, qtd){

	var status = {};
	status = iniciar(status);

	if(tipo == "pedra" || tipo == "ferro") tipoMaterial = "construcao";
	if(tipo == "ferro") qtd *= 2;

	status.inventario[tipoMaterial] += qtd;

	salvar(status);
	materiais();

};