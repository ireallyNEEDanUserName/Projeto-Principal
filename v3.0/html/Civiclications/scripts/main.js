$(document).ready(function(){
	var str = window.location.pathname;
console.log(str);

	$("#enviar").click(function(){
		var nome = $("#nomeNovo").val();
		var pais = $("#pais").val();
		console.log(nome);
		localStorage.setItem("nome", nome);
		localStorage.setItem("pais", pais);

		var local = pais + ".html";
		if (nome != "") $("#formulario").attr({"action": local});

	})

	if(str.includes("japao")){
		document.getElementById("nJogador").innerHTML = "Yōkoso " + localStorage.getItem("nome") + "-sama";
		//document.getElementById("nPais").innerHTML = "O pais selecionado foi: " + localStorage.getItem("pais");
		povoJapao();
		miningJapao();
		samurais();
		huntingJapao();
		smithingJapao();
		populacaoCidadesJapao();
		
	}
	if(str.includes("islandia")){
		document.getElementById("nJogador").innerHTML = "Velkominn herra " + localStorage.getItem("nome");
		povoIslandia();
		miningIslandia();
		vikingsIslandia();
		huntingIslandia();
		smithingIslandia();
	}
	else if(str.includes("povoar")){
		document.getElementById("nJogador").innerHTML = "PAGINA DO POVOOOOO";
	}
});



// FUNCOES JAPAO

function povoJapao(){
	var povoJp = 0;	
	document.getElementById("popJp").innerHTML = "População Total: " + povoJp;
};

function miningJapao(){
	var mineraJp = 0;
	document.getElementById("miningJp").innerHTML = "Total de Minerios disponiveis: " + mineraJp;
};

function samurais(){
	var samurais = 0
	document.getElementById("samuraiJp").innerHTML = "Total de samurais: " + samurais;
};

function huntingJapao(){
	var cacaJp = 0;
	document.getElementById("huntJp").innerHTML = "Total de caças disponiveis: " + cacaJp;
};

function smithingJapao(){
	var forjaJp = 0
	document.getElementById("smithJp").innerHTML = "Total de armas disponiveis: " + forjaJp;	
};

// Aqui acabam as funcoes do Japao

// Funções Islandia

function povoIslandia(){
	var povoIs = 300;
	document.getElementById("popIs").innerHTML = "População Disponivel: " + povoIs;
};

function miningIslandia(){
	var mineraIs = 100;
	document.getElementById("miningIs").innerHTML = "Minerios disponiveis: " + mineraIs;
};

function vikingsIslandia(){
	var vikingIs = 10000;
	document.getElementById("vikingsIs").innerHTML = "Vikings disponiveis: " + vikingIs;
};

function huntingIslandia(){
	var cacaIs = 720;
	document.getElementById("huntIs").innerHTML = "Total de caça disponivel: " + cacaIs;
};

function smithingIslandia(){
	var forjaIs = 200;
	document.getElementById("smithIs").innerHTML = "Total de armas disponiveis: " + forjaIs;
};

// Aqui acabam as funcoes da Islandia