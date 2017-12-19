function populacaoCidadesJapao(){
	var cidadeJp = 100;
	var totalLivreJp = 50;
	document.getElementById("popDispJp").innerHTML = "Total de trabaladores livres: " + totalLivreJp + " de " + cidadeJp;
	localStorage.setItem('tLivreJp', totalLivreJp)
	criaSamuraiJp();
	criaMineradorJp();
	criaFerreiroJp();
	criaCacadorJp();
	testaMining();
	mineradorCarvao();
};

//jeito novo tentando arrumar pra manter a soma sempre acrescentando valor

function criaSamuraiJp(){
		var samuraiJp = localStorage.getItem('nsamu');
		if (samuraiJp == "NaN") samuraiJp = 0;
		var samuraiJp2 = 0
		var samuraiJp3 = parseInt(samuraiJp) + parseInt(samuraiJp2)

		document.getElementById('pop').innerHTML = "Total de samurais: " +  samuraiJp3

	$("#enviar1").click(function(){
		var qntSamurai = $("#quantidade1").val();
		var qntAtual = localStorage.getItem('nsamu');
		if (qntAtual == "NaN") qntAtual = 0;
		var samuTotal = parseInt(qntSamurai) + parseInt(qntAtual);
		
		localStorage.setItem('nsamu', samuTotal); //O nmsamu é a quantidade de samurais, ele pega aqui e envia pra cima no samuraiJp
		console.log('qntSamurai');
		//document.getElementById('pop').innerHTML = "Total de samurais: " + nsamu;
	})
};

//jeito antigo, por hora vo deixar o resto assim

function criaMineradorJp(){
	var mineradorJp = localStorage.getItem('nmine');
	var totalLivreJp2 = localStorage.getItem('tLivreJp') - mineradorJp;
	document.getElementById('pop2').innerHTML = "Total de mineradores: " + mineradorJp;

	$("#enviar2").click(function(){
		var qntMineradoresJp = $("#quantidade2").val();
		var qntMineradoresJp2 = localStorage.getItem('nmine');
		var qntMineTotal = parseInt(qntMineradoresJp) + parseInt(qntMineradoresJp2)
		
		localStorage.setItem('nmine', qntMineradoresJp); //O nmsamu é a quantidade de samurais, ele pega aqui e envia pra cima no samuraiJp
		console.log('qntMineradoresJp');
	})
};

function criaFerreiroJp(){
	var ferreiroJp = localStorage.getItem('nferr');
	var totalLivreJp2 = localStorage.getItem('tLivreJp') - ferreiroJp;
	document.getElementById('pop3').innerHTML = "Total de ferreiros: " + totalLivreJp2;

	$("#enviar3").click(function(){
		var qntFerreirosJp = $("#quantidade3").val();
		var diminuiLivre = localStorage.getItem('tLivreJp') - qntFerreirosJp;
		localStorage.setItem('nferr', qntFerreirosJp); //O nmsamu é a quantidade de samurais, ele pega aqui e envia pra cima no samuraiJp
		console.log('qntFerreirosJp');
	})
};

function criaCacadorJp(){
	var cacadorJp = localStorage.getItem('ncacaJp');
	var totalLivreJp2 = localStorage.getItem('tLivreJp') - cacadorJp;
	document.getElementById('pop4').innerHTML = "Total de caçadores: " + totalLivreJp2;

$("#enviar4").click(function(){
		var qntCacadoresJp = $("#quantidade4").val();
		var diminuiLivre = localStorage.getItem('tLivreJp') - qntCacadoresJp;
		localStorage.setItem('ncacaJp', qntCacadoresJp); //O nmsamu é a quantidade de samurais, ele pega aqui e envia pra cima no samuraiJp
			// 
		console.log('qntCacadoresJp');
	})
};

function id( el ){
		return document.getElementById( el );
	}
	function menos( id_qnt ) 
	{
		var qnt = parseInt( id( id_qnt ).value );
		if( qnt > 0 )
			id( id_qnt ).value = qnt - 1; 
	} 
	function mais( id_qnt )
	{
		id( id_qnt ).value = parseInt( id( id_qnt ).value ) + 1; 
	} 

// Funções de mineração e contagem de tempo para o que é minerado.
// Por hora essa função esta funcionando.
/*

function testaMining(){
	var mineradorTeste = 0;
	document.getElementById('pop2').innerHTML = "Mineradores trabalhando " + mineradorTeste;
	localStorage.setItem('tstMining', mineradorTeste);
};
*/

function mineradorCarvao(){
	var mineradorTeste2 = localStorage.getItem('tstMining');
	if (mineradorTeste2 == 0){
		document.getElementById('mineradoresCarvao').innerHTML = "Sem mineradores para pegar carvão!"
	} else {
		document.getElementById('mineradoresCarvao').innerHTML = "Temos gente minerando CARVAO aqui."
	}
};

function mineradorFerro(){
	var mineradorTeste3 = localStorage.getItem('tstMining');
	if (mineradorTeste3 == 0){
		document.getElementById('mineradoresFerro').innerHTML = "Sem mineradores para pegar ferro!"
	} else {
		document.getElementById('mineradoresFerro').innerHTML = "Temos gente minerando FERRO aqui."
	}
};
	
function mineradorOuro(){
	var mineradorTeste4 = localStorage.getItem('tstMining');
	if (mineradorTeste4 == 0){
		document.getElementById('mineradoresOuro').innerHTML = "Sem mineradores para pegar Ouro!"
	} else {
		document.getElementById('mineradoresOuro').innerHTML = "Temos gente minerando OURO aqui."
	}
};

function mineradorPrata(){
	var mineradorTeste5 = localStorage.getItem('tstMining');
	if (mineradorTeste5 == 0){
		document.getElementById('mineradoresPrata').innerHTML = "Sem mineradores para pegar prata!"
	} else {
		document.getElementById('mineradoresPrata').innerHTML = "Temos gente minerando PRATA aqui."
	}
};
	
function mineradorCobre(){
	var mineradorTeste6 = localStorage.getItem('tstMining');
	if (mineradorTeste6 == 0){
		document.getElementById('mineradoresCobre').innerHTML = "Sem mineradores para pegar cobre!"
	} else {
		document.getElementById('mineradoresCobre').innerHTML = "Temos gente minerando COBRE aqui."
	}
};	
	

	