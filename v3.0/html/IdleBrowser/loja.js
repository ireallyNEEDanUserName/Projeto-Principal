var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(tipo, qtd){

	var status = {};
	status = iniciar(status);
	
	var custo;
	var qtdGeral;
	
	if(tipo == "pedra"){
		tipoMaterial = "minerio";
		custo = 2;
		qtdGeral = qtd;
	}
	else if(tipo == "ferro"){
		tipoMaterial = "minerio";
		custo = 5;
		qtdGeral = qtd * 2;
	}
	
	var preco = qtd * custo;
	
	if(status.inventario["dinheiro"] >= preco){
		status.inventario[tipoMaterial] += qtdGeral;
		status.inventario["dinheiro"] -= preco;
		textoFinalPagina("Comprou com sucesso " + qtd + " de " + maiuscula(tipo) + " por: " + preco);
	}
	else textoFinalPagina("Dinheiro Insuficiente");	

	salvar(status);
	materiais();

};
