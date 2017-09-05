<?php

	if(!@($conexao=pg_connect ("host=localhost port=5432 dbname=postgres user=postgres password=root"))) {
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
	}
	else {

   		$sql = "SELECT * FROM ranking WHERE versao='m' ORDER BY level desc"; 
   		$pSql = "SELECT * FROM ranking WHERE versao='p' ORDER BY level desc"; 
   		
   		$result = pg_query($conexao, $sql); 
   		$resultP = pg_query($conexao, $pSql);
   
		$all = pg_fetch_all($result);
		$allP = pg_fetch_all($resultP);
		
		echo "<table>";
		echo "<th colspan = " . "2 " .">RANKING DOS JOGADORES MOBILE</th>";
		echo "<tr>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";
		for($i = 0; $i < count($all); $i++){
			echo "<tr>";
			foreach($all[$i] as $key => $value) {
				if($value !== 'm') echo "<td>" . $value . "</td>";
			}
			echo "</tr>";
		}
		echo "<table><br>";


		echo "<br>";
		echo "<table>";
		echo "<th colspan = " . "2 " .">RANKING DOS JOGADORES PC</th>";
		echo "<tr>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";

		for($i = 0; $i < count($allP); $i++){
			echo "<tr>";
			foreach($allP[$i] as $key => $value) {
				if($value !== 'p') echo "<td>" . $value . "</td>";
			}
			echo "</tr>";
		}
		echo "</table>";

   		pg_close($conexao); 
	}

?>
