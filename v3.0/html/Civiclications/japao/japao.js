function populacaoCidadesJapao(){
	var cidadeJp = 100;
	var totalLivreJp = 50;
	document.getElementById("popDispJp").innerHTML = "Total de trabaladores livres: " + totalLivreJp + " de " + cidadeJp;
	localStorage.setItem('tLivreJp', totalLivreJp)
	criaSamuraiJp();
	criaMineradorJp();
	criaFerreiroJp();
	criaCacadorJp();
};

//jeito novo tentando arrumar pra manter a soma sempre acrescentando valor

function criaSamuraiJp(){
	var samuraiJp = localStorage.getItem('nsamu');
	var samuraiJp2 = 0
	var samuraiJp3 = parseInt(samuraiJp) + parseInt(samuraiJp2);	
	//var totalLivreJp2 = localStorage.getItem('tLivreJp') - samuraiJp; // Aqui ele diminui o total que voce selecionou com o total da cidade. 
	document.getElementById('pop').innerHTML = "Total de samurais: " + samuraiJp3; // falta deixar esses valores permanentes com cada redução.
	console.log(samuraiJp2);
	console.log(samuraiJp3);

	$("#enviar1").click(function(){
		var qntSamurai = $("#quantidade1").val();
		var diminuiLivre = localStorage.getItem('tLivreJp') - qntSamurai;
		localStorage.setItem('nsamu', qntSamurai); //O nmsamu é a quantidade de samurais, ele pega aqui e envia pra cima no samuraiJp
		console.log('qntSamurai');
	})
};

//jeito antigo, por hora vo deixar o resto assim

function criaMineradorJp(){
	var mineradorJp = localStorage.getItem('nmine');
	var totalLivreJp2 = localStorage.getItem('tLivreJp') - mineradorJp;
	document.getElementById('pop2').innerHTML = "Total de mineradores: " + totalLivreJp2;

	$("#enviar2").click(function(){
		var qntMineradoresJp = $("#quantidade2").val();
		var diminuiLivre = localStorage.getItem('tLivreJp') - qntMineradoresJp;
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

	




	

	

	