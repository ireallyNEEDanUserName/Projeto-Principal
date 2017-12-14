$(document).ready(function(){
	var str = window.location.pathname;
console.log(str);

	$("#enviar").click(function(){
		var nome = $("#nomeNovo").val();
		var pais = $("#pais").val()
		console.log(nome)
		localStorage.setItem("nome", nome);
		localStorage.setItem("pais", pais);
		return nome;
		return pais;
	})

	if(str.includes("pais")){
		//document.getElementById("nJogador").innerHTML = "Bem vindo " + localStorage.getItem("nome");
		//document.getElementById("nPais").innerHTML = "O pais selecionado foi: " + localStorage.getItem("pais");
		alert(pais + nome);


	}
})

function nomeJogador(){
	var nNome = localStorage.getItem("nome");
		document.getElementById("nJogador").innerHTML = "Yōkoso " + localStorage.getItem("nNome") + "-sama";

}