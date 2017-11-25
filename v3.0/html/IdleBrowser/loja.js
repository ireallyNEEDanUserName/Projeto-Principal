<html>

<head>

	<script type="text/javascript" src="code.js"></script>
	<script type="text/javascript" src="loja.js"></script>
	<script type="text/javascript" src="jquery-3.2.1.js"></script>
	<script type="text/javascript" src="conf.js"></script>
	<link href="style.css" type="text/css" rel="stylesheet"/>
	<meta charset="ISO-8859-1">
	
</head>

<body>
	
	<ul id="Menu">
		<li> <a id="home" href="index.html" class="Menu"> Home </a></li>
		<li class="mOpDrop"> <a id="opDrop" href="#" class="Menu"> Opcões </a>
			<div class="opContent">
				<a id="status" href="status.html" class="Menu">Status</a>
				<a id="inventario" href="inventario.html" class="Menu">Inventario</a>
			</div>
		</li>
		<li> <a id="missoes" href="missoes.html" class="Menu"> Missões </a> </li>
		<li> <a id="combate" class="Menu"> Combate </a> </li>
		<li> <a id="loja" href="loja.html" class="Menu"> Loja <a> </li>
		<li> <a id="trabalhador" href="trabalhador.html" class="Menu"> Empregados <a> </li>
	</ul>
	
	<br>
	<p id="Opcoes">
		<a class="opcoes" value="buy"> Comprar </a>
		<a class="opcoes" value="sell"> Vender </a>
	</p>


	<div id="Materiais">
		<p>
			<i class="materiais" id="minerio"> Minerio: </i>
			<i class="materiais" id="comida"> Comida:  </i>
			<i class="materiais" id="dinheiro"> Dinheiro:  </i>
		</p>
	</div>
	
	<script>
		materiais();
	</script>


	<div id="buy">
		<h3 id="titulo" value="comprar" class="titulo"> COMPRAR </h3>
		
		<script>
			criarBuy();
		</script>
	</div>
	
	
	<div id="sell">
		<h3 id="titulo" value="vender" class="titulo"> VENDER </h3>
		
		<script>
			criarSell();
		</script>
	</div>

</body>

</html>
