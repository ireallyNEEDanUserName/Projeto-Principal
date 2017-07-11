<html>
<title> Dicas Magic </title>
<p><a href="../index.php">Home</a></p>

<?php

$link = pg_connect("host=srvuxmagic01 port=5432 dbname=teste01 user=magicusr password=123!@");

$query = "SELECT * FROM dicas";

$res = pg_query($link, $query);

$resposta = pg_fetch_all($res);

$comp = count($resposta); #QUANTIDADE DE LINHAS NA TABELA
$comp2 = count($resposta[0]);
echo "comp : " . $comp . " / " . $comp2 . "<br>";
foreach($resposta as $resp){
	echo "<br>";
	foreach($resp as $key => $resp2){		
		if($key == "imagens"){
			echo "<img src=" . $resp2 . " height='60' width='60' >";
		}
		else{
			echo " " . $resp2 . "<br>";
		}
	}
	echo"<br>";
}

?>

</html>
