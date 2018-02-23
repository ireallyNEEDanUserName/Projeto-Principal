<html>
<body>

        <?php
                echo "INICIIOOOOOOOo <br>";
                $strBanco = "host=172.16.19.140 port=5432 bdname=portal_tst user=portalusr password=P0rta1!";


                if(!@($conexao = pg_connect($strBanco))){
                        print "Num deu boa";
                        echo "ERRRORRR";
                }else{

                        $sql = "SELECT * FROM inv_srv";
                        $result = pg_query($conexao, $sql);
                        $resultAll = pg_fetch_all($result);

                        echo "<table>";
			echo "<th colspan = " . "2 " ."></th>";
			echo "<tr>
					<th>Hostname |</th>
					<th>IP</th>
				</tr>";

                        foreach($resultAll as $key){
                                echo "<tr>";
                                echo "<td>" . $key['hostname'] . " |</td>";
                                echo "<td>" . $key['ip'] . "</td>>";
                                echo "</tr>";
                        }
                        echo "</table>";

                        pg_close($conexao);

                }

        ?>




</body>
</html>

/* se quiser ja me ajudar a colocar os campos dentro da tabela, eu agradeço hahahahaha
a tabela ficara assim:

hostname | IP
XXXXXXXX | XXXXXX

vlw 

*/
