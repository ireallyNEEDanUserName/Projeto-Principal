var impInv = function(){
	var status = {};
	status = iniciar(status);
	
	var ult = document.getElementById('barraInvt');
	
	var div = "<div id='inventario'>";
	
	for(var key in status.inventario){
		console.log(key);
		div += "<p>"
		div += key + " : " + status.inventario[key]  + " ";
		div += "</p>";
	}
	
	div += "</div>";
	
	ult.insertAdjacentHTML('beforeend', div);
}