var start = function(){

	var status = {};
	status = iniciar(status);
	
	criarElem(status.empregados);
	updateEmp(status.empregados);
	
	window.addEventListener("beforeunload", function(){
		localStorage.setItem("Jogador", JSON.stringify(status));
	});
	
};

var criarElem = function(empregados){

	var emp = "<div id='forja' class='habilidade'>" +
			"<div id='Forja'>" +	
			"<p id='ForjarItem' class='item'>Forjar</p>" +
			"<div id='barraProgressoForjarItem' class='progresso'>" +
			"<div id='barraForjarItem' class='barra'>0 %</div>" +
			"</div>" +
			"</div>" +
			"</div>";
			
	var ult = document.getElementById('Menu');
	console.log(emp);
	ult.insertAdjacentHTML('beforeend', emp);
};

var updateEmp = function(empregados){};