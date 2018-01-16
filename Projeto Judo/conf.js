$(document).ready(function(){
	
	
	$("#enviar").click(function(){
		
		if($("#select").val() == "#") alert("Escolha um genero");
		else if($("#caixaNome").val() == null) alert("Digite um nome");
		else{
			var dict = {};
			
			if($("#tabela").val() == "sim") console.log("Nova Tabela");
			else{
				dict = loadData();
			}
			
			
			console.log($("#caixaNome").val() + "  " + $("#select").val());
			
			dict[$("#caixaNome").val()] = {nome: $("#caixaNome").val(), genero: $("#select").val(), continua: true};
			
			localStorage.setItem("tabela", JSON.stringify(dict));
			
			console.log(dict);
			alert("Espera");

		}
		
	})

});