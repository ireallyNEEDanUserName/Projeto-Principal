$(document).ready(function(){
	$('h3').click(function(){
		var href = $(this).attr('href');
		$('#centro').load( href );
		$(this).css({ 'color': 'blue', 'text-decoration': 'underline'});
	})
});
