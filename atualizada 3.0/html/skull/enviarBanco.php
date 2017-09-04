<?php
$conn_str = "host=localhost port=5432 dbname=postgres user=postgres password=root";
$connect = pg_connect($conn_str);

$nome = $_POST['nome'];
$fase = $_POST['fase'];

if($fase > 1){
	$query = "INSERT INTO ranking VALUES ('$nome', $fase)";

	$qResult = pg_query($connect, $query);
}
pg_close($connect);

?>