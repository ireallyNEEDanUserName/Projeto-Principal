$(document).ready(function(){
	$('a').click(function(){
		var href = $(this).attr('href');
		$('#centro').load( href );
	})
});
