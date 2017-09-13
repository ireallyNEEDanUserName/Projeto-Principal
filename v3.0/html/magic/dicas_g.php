<html>	

	<title> Tipos de Decks</title>

	<link href="../logo.css" type="text/css" rel="stylesheet" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="cardo.css" type="text/css" rel="stylesheet" media="all" />
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
	
	<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
  google_ad_client: "ca-pub-9731344339248002",
  enable_page_level_ads: true
  });
</script> 

	<body ng-app="">
		<div id="topo">
			<h1 ALIGN="center">Tipos de decks existentes! </h1>
		 </div>

		<div ng-include="'../menu.php'"> </div>

		<div id="centro">

			<?php
				if(!($conexao = pg_connect("host=srvuxmagic01 port=5432 dbname=magic user=magicusr password=123!@"))){
        				print "Não foi possivel conectar no banco.";
				}else{
        				$query = "select * from dicas_m";
				        $result = pg_query($conexao, $query);
				        while($consulta = pg_fetch_assoc($result)){
               					echo "<div id=\"todos\"> <img id=\"moldura\" src=\"" . $consulta['moldura'] . "\"/>";
                				echo "<div id=\"dvnome\">" . $consulta['nome'] . "</div>";
                				echo "<div id=\"dvid\">" . $consulta['id'] . "</div>";
                				echo "<div id=\"dvfoto\">  <img id=\"background\" src=\"" . $consulta['imagem'] . "\"/> </div>";
                				echo "<div id=\"dvdesc\">" . $consulta['descricao'] . "</div>";
                				/*echo "<div class=\"clear\"></div>";*/
                				echo "</div>";
        			}
			        pg_close($conexao);
				}

			?>
		</div>

		<div ng-include="'../publi_d.html'"> </div>
	</body>
<html>
