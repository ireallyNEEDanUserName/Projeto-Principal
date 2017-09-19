<?php

	if(count($_POST) == 0){
		$tipo = "todos";
	}
	else if($_POST["Ranking"] != "opcoes"){
		$tipo = $_POST["Ranking"];
	} else if(array_key_exists("Pesquisa", $_POST)){
		$tipo = $_POST["Pesquisa"];
	}
	
	$texto;

	if($tipo == 'm') $texto = "MOBILE";
	else if($tipo == 'p') $texto = "PC";
	else if($tipo == 'mh') $texto = "MOBILE COM CODIGO";
	else if($tipo == 'ph') $texto = "PC COM CODIGO";
	else if(array_key_exists("Pesquisa", $_POST)) $texto = $_POST["Pesquisa"];
	
	$strBanco = "host=localhost port=5432 dbname=skull user=skullusr password=S@k4lL!";
	$strBancoTeste = "host=localhost port=5432 dbname=postgres user=postgres password=root";

	if(!@($conexao=pg_connect ($strBanco))) {
		print "Não foi possível estabelecer uma conexão com o banco de dados.";
	}
	else {

		if($_POST == null or $tipo == "todos"){

   			$sql = "SELECT * FROM ranking WHERE tipo= 'm' ORDER BY fase desc LIMIT 10"; 
   			$pSql = "SELECT * FROM ranking WHERE tipo='p' ORDER BY fase desc LIMIT 10"; 
   		
   			$result = pg_query($conexao, $sql); 
   			$resultP = pg_query($conexao, $pSql);
   
			$all = pg_fetch_all($result);
			$allP = pg_fetch_all($resultP);
		
			echo "<br>";
			echo "<table>";
			echo "<th colspan = " . "3 " .">RANKING DOS JOGADORES MOBILE</th>";
			echo "<tr>
					<th>Posição</th>
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
			echo "<th colspan = " . "3 " .">RANKING DOS JOGADORES PC</th>";
			echo "<tr>
					<th>Posição</th>
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

		}
		else if($tipo == 'm' or $tipo == 'p' or $tipo == 'mh' or $tipo == 'ph'){

			$sql = "SELECT * FROM ranking WHERE tipo= '$tipo' ORDER BY fase desc LIMIT 20"; 
   		
   			$result = pg_query($conexao, $sql);
   			$all = pg_fetch_all($result);
		
			echo "<br>";
			echo "<table>";
			echo "<th colspan = " . "3 " .">RANKING DOS JOGADORES $texto</th>";
			echo "<tr>
					<th>Posição</th>
					<th>Nome</th>
					<th>Fase</th>
				</tr>";
		
			for($i = 0; $i < count($all); $i++){
				echo "<tr>";
				echo "<td>" . ($i + 1) . "</td>";
				foreach($all[$i] as $key => $value) {
					if($value !== $tipo) echo "<td>" . $value . "</td>";
				}
				echo "</tr>";
			}
			echo "<table>"; 

		}
		else{
			$sql = "SELECT * FROM ranking WHERE name= '$tipo' ORDER BY fase desc"; 
   		
   			$result = pg_query($conexao, $sql);
   			$all = pg_fetch_all($result);

   			if($all != false){
		
				echo "<br>";
				echo "<table>";
				echo "<th colspan = " . "3 " .">RANKING DO JOGADOR " . strtoupper($texto) . "</th>";
				echo "<tr>
						<th>Posição</th>
						<th>Nome</th>
						<th>Fase</th>
					</tr>";
		
				for($i = 0; $i < count($all); $i++){
					echo "<tr>";
					echo "<td>" . ($i + 1) . "</td>";
					foreach($all[$i] as $key => $value) {
						if($key !== 'tipo') echo "<td>" . $value . "</td>";
					}
					echo "</tr>";
				}
				echo "<table>";
			}else{

				echo "<p>JOGADOR " . strtoupper($tipo)  . " NÃO ENCONTRADO!!!</p>";
			}
		}

   		pg_close($conexao); 
	}

?>
