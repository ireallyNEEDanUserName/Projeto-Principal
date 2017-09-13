<html>	
	<title> Magic The Apping </title>

	<link href="../logo.css" type="text/css" rel="stylesheet" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="cardo.css" type="text/css" rel="stylesheet" media="all" />
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	
	<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
  google_ad_client: "ca-pub-9731344339248002",
  enable_page_level_ads: true
  });
</script> 

	<body>

<div id="logom" align="center" >
		<ul>
                		
				<a href="inicial.php"> <img src="http://i.imgur.com/X4o5pMj.png" height='80' width='80' . title="Dicas para Decks"/></a>
				<a href="../index.html"> <img src="../img/NDL10.jpg" alt="Logo do Site" title="NDL" width="80" height="80"/></a>
				<a href="/skull/skull.html"> <img src="http://i.imgur.com/xMbgTmA.png" height='80' width='80' . title="Skull Invaders"/> </a>

		</ul>
</div>
				<h1 ALIGN="center"> Tipos de Baralhos</h1>
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





	</body>

<html>
