<html>	<title>Efeitos dos Cards</title>

	<link href="../logo.css" type="text/css" rel="stylesheet" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="cardo.css" type="text/css" rel="stylesheet" media="all" />
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

	<body>
		<div id="topo">
			<div id="logo">
				<a href="../index.html">
					<img src="../img/NDL10.jpg" alt="Logo do Site" title="NDL" width="80" height="80" /> 
				</a>
			</div> 
			<h1 ALIGN="center">Efeitos dos cards e o que significam. </h1>
		 </div>

		<div id="menu">

			<h3 ALIGN="center">Nossos Apps </h3>

				<ul>
					<li><a href="/magic/inicial.php">Magic The Apping </a> </li>
					<li><a href="/skull/skull.html">Skull Invaders</a></li>
					<li>Link pro video</li>
				</ul>
			<h3 ALIGN="center">APP por IMG </h3>

				 <ul>
                                        <li1> <a href="/magic/inicial.php"> <img src="http://i.imgur.com/ZIMl4W5.png" height='50' width='50' . title="Magic the Apping"/> </a> </li1>
                                        <li1><a href="/skull/skull.html"> <img src="http://i.imgur.com/xMbgTmA.png" height='50' width='50' . title="Skull Invaders"/> </a> </li1>
                                </ul>


		</div>

		<div id="centro">
			<?php
				if(!($conexao = pg_connect("host=srvuxmagic01 port=5432 dbname=magic user=magicusr password=123!@"))){
        				print "Não foi possivel conectar no banco.";
				}else{
        				$query = "select * from dicas_h";
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
	</body>
<html>
