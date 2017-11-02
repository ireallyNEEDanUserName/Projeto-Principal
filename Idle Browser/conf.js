
$(document).ready(function(){

	$('#barra').click(function(){
		clickBarraFunc(true);
		
		cor(this, 'black', 'green');
		
	})
	
	//OPCOES DA PAGINA MISSOES.HTML
	$('.opcoes').click(function(){
		var clicked = $(this).attr("value");
		$("#" + clicked).toggle();
		$(this).css({ 'color' : 'white'	})
	})
	
	$('.item').click(function(){
		var clicked = $(this).attr("id");
		
		start(clicked);
	})
	
});



var cor = function(self, corPrincipal, corSecundaria){
	if (self.style.color == corPrincipal){
		$(self).css({
			'color' : corSecundaria,
		})
	}
	else{
		$(self).css({
			'color' : corPrincipal,
		})
	}
};
