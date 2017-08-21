$(document).ready(function(){
	$(this).click(function(){
		var href = $(this).attr('href');
		$( "#centro" ).load(href);
	})
});
