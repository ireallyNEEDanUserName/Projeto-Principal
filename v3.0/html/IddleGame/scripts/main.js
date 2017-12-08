/*function CriaBixos(nome,vida){
	this.nome=nomeBixo;
	this.vida=vidaBixo;
	
}

rato = New CriaBixos('Rato',10)

macaco = New CriaBixos('Macaco',15)

javali = New CriaBixos('Javali',20)
*/

/*
function morte(){
	document.getElementById('rt').innerHTML = 'Rato morto!!';
	document.getElementById('mc').innerHTML = 'Macaco morto!!';
	document.getElementById('jv').innerHTML = 'Javali morto!!';
}
*/

// Funcao para "bixos mortos"
function morteRato(matarato){
var elem = document.getElementById("rt")
document.getElementById('rt').innerHTML = 'Matando Ratos!!';
contaRatoMorto();
}

function morteMacaco(matamacaco){
var elem = document.getElementById("mc")
document.getElementById('mc').innerHTML = 'Matando Macacos !!';
contaMacacoMorto();
}

function morteJavali(matajavali){
var elem = document.getElementById("jv")
document.getElementById('jv').innerHTML = 'Matando Javalis!!';
contaJavaliMorto();
}
//###################################################################
// Contadores

var rtMorto = 0;
var rtMortos = 0
function contaRatoMorto(){
	rtMorto = rtMorto +1;
	document.getElementById('rmorto').innerHTML = rtMorto;
	localStorage.setItem("srMorto", rtMorto); //aqui eu salvo
	return rtMorto;
}

var mcMorto = 0;
function contaMacacoMorto(){
	mcMorto = mcMorto +1;
	document.getElementById('mmorto').innerHTML = mcMorto;
}

var jvMorto = 0;
function contaJavaliMorto(){
	jvMorto = jvMorto +1;
	document.getElementById('jmorto').innerHTML = jvMorto;
}

//###################################################################
// Guardar valor de cliques
function carregaRatoMorto(){

	var crMorto = localStorage.getItem("srMorto")
	document.getElementById('trMorto').valu = crMorto;
}

/*
function mudacontador(){
	document.getElementById('trMorto').innerHTML = crMorto;
	alert('crMorto');
} */
