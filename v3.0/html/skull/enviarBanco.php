<?php
$conn_str = "host=localhost port=5432 dbname=skull user=skullusr password=S@k4lL!";
$connect = pg_connect($conn_str);

$nome = $_POST['nome'];
$fase = $_POST['fase'];
$tipo = $_POST['tipo'];

if($fase > 1){
	$query = "INSERT INTO ranking VALUES ('$nome', $fase, '$tipo')";

	$qResult = pg_query($connect, $query);
}
pg_close($connect);

?>
