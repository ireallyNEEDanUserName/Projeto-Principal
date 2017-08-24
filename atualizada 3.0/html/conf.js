$(document).ready(function(){
	$('a').click(function(){
		var href = $(this).attr('name');
		$('#centro').load( href );
	})
});
