<?php
        if(!($conexao = pg_connect("host=srvuxmagic01 port=5432 dbname=magic user=magicusr password=123!@"))){
                print "Não foi possivel conectar no banco.";
        }else{
               $query = "select * from dicas_h";
               $result = pg_query($conexao, $query);

               $selecionada = rand(0, count(pg_fetch_all($result)));
               while($consulta = pg_fetch_assoc($result)){
                        if($consulta['id'] == $selecionada){
                               echo "<div id=\"todos\"> <img id=\"moldura\" src=\"" . $consulta['moldura'] . "\"/>";
                               echo "<div id=\"dvnome\">" . $consulta['nome'] . "</div>";
                               echo "<div id=\"dvid\">" . $consulta['id'] . "</div>";
                               echo "<div id=\"dvfoto\">  <img id=\"background\" src=\"" . $consulta['imagem'] . "\"/> </div>";
                               echo "<div id=\"dvdesc\">" . $consulta['descricao'] . "</div>";
                               /*echo "<div class=\"clear\"></div>";*/
                               echo "</div>";
                        }
                }
        pg_close($conexao);
        }
?>
