<?php
		
	$strBanco = "host=localhost port=5432 dbname=skull user=skullusr password=S@k4lL!";
	$strBancoTeste = "host=localhost port=5432 dbname=postgres user=postgres password=root";
	if(!@($conexao=pg_connect ($strBanco))) {
		print "N�o foi poss�vel estabelecer uma conex�o com o banco de dados.";
	}
	else {
   		$sql = "SELECT * FROM ranking WHERE tipo= 'm' ORDER BY fase desc LIMIT 5"; 
   		$pSql = "SELECT * FROM ranking WHERE tipo='p' ORDER BY fase desc LIMIT 5"; 
   		
   		$result = pg_query($conexao, $sql); 
   		$resultP = pg_query($conexao, $pSql);
   
		$all = pg_fetch_all($result);
		$allP = pg_fetch_all($resultP);
		
		echo "<br>";
		echo "<table>";
		echo "<th colspan = " . "3 " .">RANKING MOBILE</th>";
		echo "<tr>
				<th>Posi��o</th>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";
		
		for($i = 0; $i < count($all); $i++){
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
		echo "<th colspan = " . "3 " .">RANKING PC</th>";
		echo "<tr>
				<th>Posi��o</th>
				<th>Nome</th>
				<th>Fase</th>
			</tr>";
		for($i = 0; $i < count($allP); $i++){
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