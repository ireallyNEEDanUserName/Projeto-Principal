<html>
	<head>
		<title>Ranking</title>
		<link href="../logo.css" type="text/css" rel="stylesheet"/>
		<link href="style.css" type="text/css" rel="stylesheet"/>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>	
		
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
		<script>
  			(adsbygoogle = window.adsbygoogle || []).push({
  			google_ad_client: "ca-pub-9731344339248002",
  			enable_page_level_ads: true
  			});
		</script> 
		
	</head>

	<body ng-app="">
	
		<div id="topo">
        		<h1 ALIGN="center">Os melhores defensores da terra!!! </h1>
        	</div>
	
		<div ng-include="'../menu.php'"> </div>

		<div id="centro">

			<form method="POST" action="ranking.php">
				<p id="textoRanking"> Selecione qual ranking deseja visualizar. </p>
				<select name="Ranking">
					<option value="todos"> Todos Rankings </option>
					<option value="m"> Mobile </option>
					<option value="mh"> Mobile Com Codigo </option>
					<option value="p"> PC </option>
					<option value="ph"> PC Com Codigo </option>
				</select>
				<input type="submit" value="submit">
			</form>

			<div id="rankingEscolhido">
				<?php include 'rankingBanco.php'; ?>	
			</div>
		</div>

		<div ng-include="'../publi_d.html'"> </div>


	</body>

</html>
