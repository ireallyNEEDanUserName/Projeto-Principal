$(document).ready(function(){

	$('#barra').click(function(){
		clickBarraFunc(true);
		
		if (this.style.color == 'black'){
			$(this).css({
				'color' : 'white',
				'background-color': 'black'
			})
		}
		else{
			$(this).css({
				'color' : 'black',
				'background-color': 'white'
			})
		}
		
	})
	
	//OPCOES DA PAGINA MISSOES.HTML
	$('.opcoes').click(function(){
		var clicked = $(this).attr("value");
		$("#" + clicked).toggle();
		$(this).css({ 'color' : 'white'	})
	})
	
	$('.opcoes').mouseover(function(){
		if (this.style.color == 'black'){
			$(this).css({
				'color' : 'white',
			})
		}
		else{
			$(this).css({
				'color' : 'black',
			})
		}
	})
	
	$('.item').click(function(){
		var clicked = $(this).text();
		
		if($(this).attr("id") == "textoForjarPedra"){
			clicked = "ForjarPedra";
		}
		
		console.log(this);
		start(clicked);
	})
	
});
