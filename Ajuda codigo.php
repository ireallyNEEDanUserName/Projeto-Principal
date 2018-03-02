<?php
	
	echo "Inicio: <br>";
	$strBanco = "host=172.16.19.140 port=5432 dbname=portal_tst user=portalusr password=P0rtal!";
	
	if(!@($conexao = pg_connect($strBanco))){
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
		echo "ERRO: <BR>";
	}else{
		$sql = "SELECT COUNT(IP) AS ATUALIZAR FROM inv_srv WHERE obsolescencia='SIM'";
		$result = pg_query($conexao, $sql);
		$resultAll = pg_fetch_all($result);
		
		echo "Funciona";
		
		foreach($resultAll as $key){
			echo "Hostname: " . $key['hostname'] . "<br>";
			echo "IP: " . $key['ip'] . "<br>"
		}
		
		pg_close($conexao);
	}
	
	echo "FIM <br>";

?>
