var load = function(){
	
	var orgchart = new getOrgChart(document.getElementById("chart_div"),{			
    orientation: getOrgChart.RO_LEFT,
	datasource: [ {id: 1, parentId: null, name: "Vencedor" }]});
	
	
};

var loadData = function(){
	
	
	var dict = {};
	var load = localStorage.getItem("tabela");
	if(JSON.parse(load) == null) ;
	else dict = JSON.parse(load);
	
	return dict;
};



load();