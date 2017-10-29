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
	
});