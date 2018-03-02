<?php
	
	echo "Inicio: <br>";
	$strBanco = "host=172.16.19.140 port=5432 dbname=portal_tst user=portalusr password=P0rtal!";
	
	if(!@($conexao = pg_connect($strBanco))){
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
		echo "ERRO: <BR>";
	}else{
		$sql = "SELECT * FROM inv_srv";
		$result = pg_query($conexao, $sql);
		$resultAll = pg_fetch_all($result);
		
		echo "Funciona";
		
		$total = array(
					"sim" => 0,
					"nao" => 0,
					"migrar" => 0);
		foreach($resultAll as $key){
			if($key['obsolescencia'] == "SIM") $total["sim"]++;
			else if($key['obsolescencia'] == "NAO") $total["nao"]++;
			else if($key['obsolescencia'] == "MIGRAR") $total["migrar"]++;
		}
		
		foreach($total as $chave){
			echo $chave . ": " . $total[$chave] . " | ";
		}
		//echo $total;
		
		pg_close($conexao);
	}
	
	echo "FIM <br>";

?>
