<?php

	if(!@($conexao=pg_connect ("host=localhost port=5432 dbname=postgres user=postgres password=root"))) {
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
	}
	else {

   		$sql = "SELECT * FROM ranking ORDER BY level desc"; 
   		$result = pg_query($conexao, $sql); 
   
		$all = pg_fetch_all($result);
		

		for($i = 0; $i < count($all); $i++){
			echo "<tr>";
			foreach($all[$i] as $key => $value) {
				echo "<td>" . $value . "</td>";
			}
			echo "</tr>";

		}
   		pg_close($conexao); 
	}

?>
