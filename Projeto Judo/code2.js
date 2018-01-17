var load = function(){
	
	var div = document.getElementById("chart_div");
	console.log(loadData());
	
	var orgchart = new getOrgChart(div, {
        orientation: getOrgChart.RO_RIGHT,
        dataSource: [ { id: 1, parentID: null, Name: "Vencedor"} ] 
    });
	
	var data = loadData();
	
	var arrayNome = new Array();
	arrayNome[0] = "";
	arrayNome[1] = "Vencedor";
	arrayNome[2] = "Semi-Final";
	arrayNome[3] = "Quartas-de-Final";
	arrayNome[4] = "Oitavas-de-Final";
	
	var y = Math.floor(Object.keys(data).length / 2);
	console.log(y);
	
	for(var x = 1; x < y; x++){
		console.log("X:" + x);
		var u = x;
		for(var z = 1; z <= x * 2; z++){
			
			console.log("Z:" + z);
			var nome = arrayNome[u + 1].concat(z.toString());
			if(x == 1) var nomePai = 1;
			else var nomePai = arrayNome[u].concat(z.toString());
			
			orgchart.insertNode(nomePai, {Name: arrayNome[u + 1]}, nome);
		}
	}
	
	var xData = 2;
	x = 1;
	f = 1;
	for(var key in data){
		var nome = arrayNome[x + 1].concat(f.toString());
		orgchart.insertNode(nome, {Name: data[key].nome}, data[key].nome);
		xData++;
		f++;
		if(f > 2){
			f = 1;
		}
	}
	
	
	
	
};

var loadData = function(){
	
	
	var dict = {};
	var load = localStorage.getItem("tabela");
	if(JSON.parse(load) == null) ;
	else dict = JSON.parse(load);
	
	return dict;
};
