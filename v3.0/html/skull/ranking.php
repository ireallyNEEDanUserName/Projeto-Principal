<html>	<title>Ranking do Jogo</title>

<head>Ranking do jogo Skull Invaders </head>

<?php
if(!@($conexao=pg_connect ("host=srvuxmagic01 dbname=skull port=5432 user=skullusr password=S@k4lL!"))) {
   print "Não foi possível estabelecer uma conexão com o banco de dados.";
} else {

   $sql = "SELECT * FROM ranking"; 
   $result = pg_exec($conexao, $sql); 
 
   /* Escreve resultados até que não haja mais linhas na tabela */ 
   for($i=0; $consulta = @pg_fetch_array($result, $i); $i++) { 
      echo "Coluna1: " . $consulta['id'] . " - Coluna2:" . $consulta['nome'] . "<br>"; 
   } 
   pg_close($conexao); 
}





?>




</html>
