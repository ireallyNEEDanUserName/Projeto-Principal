<?php
	
	$strBanco = "host=localhost port=5432 dbname=skull user=skullusr password=S@k4lL!";
	$strBancoTeste = "host=localhost port=5432 dbname=postgres user=postgres password=root";

	if(!@($conexao=pg_connect ($strBanco))) {
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
	}
	else {

   		$sql = "SELECT * FROM ranking WHERE tipo='m' ORDER BY fase desc"; 
   		$pSql = "SELECT * FROM ranking WHERE tipo='p' ORDER BY fase desc"; 
   		
   		$result = pg_query($conexao, $sql); 
   		$resultP = pg_query($conexao, $pSql);
   
		$all = pg_fetch_all($result);
		$allP = pg_fetch_all($resultP);
		
		echo "<table>";
		echo "<th colspan = " . "3 " .">RANKING DOS JOGADORES MOBILE</th>";
		echo "<tr>
				<th>Posição</th>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";
		
		$s = 0;
		if(count($all) > 10) $s = 10;
		else $s = $all;
		for($i = 0; $i <= $s; $i++){
			echo "<tr>";
			echo "<td>" . ($i + 1) . "</td>";
			foreach($all[$i] as $key => $value) {
				if($value !== 'm') echo "<td>" . $value . "</td>";
			}
			echo "</tr>";
		}
		echo "<table><br>";


		echo "<br>";
		echo "<table>";
		echo "<th colspan = " . "3 " .">RANKING DOS JOGADORES PC</th>";
		echo "<tr>
				<th>Posição</th>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";
		
		if(count($allP) > 10) $s = 10;
		else $s = $allP;
		for($i = 0; $i <= $s; $i++){
			echo "<tr>";
			echo "<td>" . ($i + 1) . "</td>";
			foreach($allP[$i] as $key => $value) {
				if($value !== 'p') echo "<td>" . $value . "</td>";
			}
			echo "</tr>";
		}
		echo "</table>";

   		pg_close($conexao); 
	}

?>
