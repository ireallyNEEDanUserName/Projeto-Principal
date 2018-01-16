var load = function(){
	
	
	google.charts.load('current', {packages:["orgchart"]});
    google.charts.setOnLoadCallback(drawChart);
	
	
	function drawChart(){
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'nome');
		data.addColumn('string', 'anterior');
		data.addColumn('string', 'genero');
		
		data.addRows([['Vencedor', '', '']]);
		var arrayX = new Array();
		arrayX[0] = "Vencedor";
		arrayX[1] = "Semi-Final";
		arrayX[2] = "Quartas-de-Final";
		arrayX[2] = "Oitavas-de-Final";
			
		var dict = {};
		dict = loadData();
		var y = Math.floor(Object.keys(dict).length / 2);
		
		for(x = 1; x < y - 1; x++){
			console.log("x: " + x);
			for(z = 1; z <= x * 2; z++){
				if(x == 1) var nome = arrayX[x-1];
				else var nome = arrayX[x-1] + " " + Math.ceil(z / 2).toString();
				console.log("z: " + z + " " + nome);
				data.addRows([[arrayX[x] + " " + z.toString(), nome , z.toString()]]);
			}
			
			
		}
		var f = 1;
		for(var keys in dict){
			
			nome = arrayX[2] + " " + Math.ceil(f / 2).toString();
			data.addRows([[keys, nome, '']]);
			console.log(keys + " " + nome);
			
			f++;
		}
	
		// Create the chart.
        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        // Draw the chart, setting the allowHtml option to true for the tooltips.
        chart.draw(data, {allowHtml:true});
		
	}
	
	
	console.log("Load");
};

load();


var loadData = function(){
	
	
	var dict = {};
	var load = localStorage.getItem("tabela");
	if(JSON.parse(load) == null) ;
	else dict = JSON.parse(load);
	
	return dict;
};