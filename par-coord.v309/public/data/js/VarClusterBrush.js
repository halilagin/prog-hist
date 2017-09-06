/**
 * Created by halil on 22/08/2017.
 */



function VarClusterBrushConfig() {
  this.brushes= [];

  this.scales={
    "xscale":d3.scale.linear().domain([0,10]).range([0,boxWidth]),
    "yscale":d3.scale.linear().domain([10,0]).range([0,boxWidth]),
    "rscale":d3.scale.linear().domain([10,0]).range([0,boxWidth]),
    "boxxscale":d3.scale.linear().domain([-1,1]).range([0,boxWidth]),
    "boxyscale":d3.scale.linear().domain([-1,1]).range([boxWidth, 0]),
    "x":function(){},
    "y":function(){},
    "rx":function(){},
    "ry":function(){}


  };



  this.position = function (idx, x,y, r){
    this.brushes[idx].x = x;
    this.brushes[idx].y = y;
    this.brushes[idx].r1 = r;
    this.brushes[idx].r2 = r*1.1;
  };



  this.init = function(g_, data){//data:{centroids, C, members, extents}
    this.brushes=[];
    for (var i=0;i<data.centroids.length;i++)
      this.brushes.push({"x":0,"y":0,"r1":0,"r2":0, brush:null});

    this.scales.xscale = d3.scale.linear().domain(data.extents[0]).range([-1,1]);
    this.scales.yscale = d3.scale.linear().domain([data.extents[1][0],data.extents[1][1]]).range([-1,1]);
    this.scales.boxxscale = d3.scale.linear().domain([-1,1]).range([0,boxWidth]);
    this.scales.boxyscale = d3.scale.linear().domain([-1,1]).range([boxWidth,0]);
    this.scales.rscale = d3.scale.linear().domain([0, Math.sqrt(2)*boxWidth ]).range([0, 2*Math.sqrt(2)]);

    this.scales.x = (ex)=>{
      return this.scales.boxxscale(this.scales.xscale(ex));
    };

    this.scales.rx = (ex)=>{
      return this.scales.xscale.invert(this.scales.boxxscale.invert(ex));
    };

    this.scales.y = (ex)=>{
      return this.scales.boxyscale(this.scales.yscale(ex));
    };

    this.scales.ry = (ex)=>{
      return this.scales.yscale.invert(this.scales.boxyscale.invert(ex));
    };


    data["membersScaled"]=[];
    var colors=["red", "green", "blue"];
    for (var k=0;k<data.members.length;k++) {
      var clusterMember = data.members[k];
      data["membersScaled"].push([]);
      for (var i = 0; i < clusterMember.length; i++) {
        //var x_ = this.scales.boxxscale(this.scales.xscale(clusterMember[i][0]));
        var x_ = this.scales.x(clusterMember[i][0]);
        var y_ = this.scales.y(clusterMember[i][1]);
        data["membersScaled"][k].push([x_,y_]);
        g_.append("svg:circle")
          .attr('cx', x_)
          .attr('cy', y_)
          .attr('r', 1)
          .attr('fill', colors[k]);

      }
    }

    this.data = data;
  };
}//VarClusterBrushConfig







var ClusterBrushSelectedPointIndexes = {};


function VarClusterBrush(container){
  this.container = container;
  this.cluster_brush_handle_dragstart = function (){
    var this__= d3.select(this);
    this__.style('fill', 'red');
  };

  this.cluster_brush_handle_drag = function (){
    var this__= d3.select(this);
    this__.attr('cx', d3.event.x)
      .attr('cy', d3.event.y);

    var clazz = $(this).attr("class").split(" ")[1];
    var _idx= clazz.indexOf("_");
    var idxes =clazz.substring(_idx+1).split("_");

    var brushIdx= idxes[0];
    var handleIdx = idxes[1];

    var brushHandle =clusterBrushConfig.brushes[brushIdx].brush.b1;
    if (handleIdx==1)
      brushHandle = clusterBrushConfig.brushes[brushIdx].brush.b2;

    var newR = Math.sqrt(Math.pow(d3.event.x-clusterBrushConfig.brushes[brushIdx].x, 2)+Math.pow(d3.event.y-clusterBrushConfig.brushes[brushIdx].y, 2));
    brushHandle.attr("r", newR);
  };


  this.cluster_brush_handle_dragend = function (){
    var this__= d3.select(this);


    //find panel information
    var clusterBrushPanelClass = $(this).parent().attr("class");
    var clusterBrushPanelClass_ = clusterBrushPanelClass.substring(clusterBrushPanelClass.indexOf("clusterbrush_panel_")+"clusterbrush_panel_".length);
    var clusterBrushPanelDimName = clusterBrushPanelClass_.substring(0, clusterBrushPanelClass_.lastIndexOf("_"));
    var clusterBrushPanelDimIdx = +clusterBrushPanelClass_.substring(clusterBrushPanelClass_.lastIndexOf("_")+1);


    var clazz = $(this).attr("class").split(" ")[1].substring("cbhandle_".length);
    var idxes = clazz.split("_");
    var brushIdx = +idxes[0];
    var bhandleIdx = +idxes[1];
    var cb = clusterBrushConfig.brushes[brushIdx];
    var brushCenter = [clusterBrushConfig.brushes[brushIdx].x,clusterBrushConfig.brushes[brushIdx].y];

    var r1 = $(cb.brush.b1[0]).attr("r");
    var r2 = $(cb.brush.b2[0]).attr("r");

    if (ClusterBrushSelectedPointIndexes[clusterBrushPanelDimName]==undefined || ClusterBrushSelectedPointIndexes[clusterBrushPanelDimName]==null) {
      ClusterBrushSelectedPointIndexes[clusterBrushPanelDimName] = [];
      for (var k=0;k<clusterBrushConfig.data.membersScaled.length;k++) {
        ClusterBrushSelectedPointIndexes[clusterBrushPanelDimName].push([]);
      }
    }

    for (var k=0;k<clusterBrushConfig.data.membersScaled.length;k++) {
      var cluster = clusterBrushConfig.data.membersScaled[k];
      for (var i = 0; i < cluster.length; i++) {
        var distx = cluster[i][0]-brushCenter[0];
        var disty = cluster[i][1]-brushCenter[1];
        var dist = Math.sqrt(distx*distx+disty*disty);

        if (dist>r1 && dist<r2)
          ClusterBrushSelectedPointIndexes[clusterBrushPanelDimName][k].push(i);
      }
    }

    this__.style('fill', 'blue');
  };


  this.drag = d3.behavior.drag()
    .on('dragstart', this.cluster_brush_handle_dragstart)
    .on('drag', this.cluster_brush_handle_drag)
    .on('dragend', this.cluster_brush_handle_dragend);



  this.createClusterBrush = function (g_, cbConfig, idx){//cb:cluster brush
    var cb = cbConfig.brushes[idx];
    var x  = cb.x;
    var y = cb.y;
    var r1 = cb.r1;
    var r2 = cb.r2;

    var clusterBrush = {"b1":null,"b2":null, "b1handle":null, "b2handle":null};


    clusterBrush.b2= g_.append("svg:circle")
      .attr("class", "cluster_brush cluster_brush_c2")
      .attr('cx', cbConfig.brushes[idx].x)
      .attr('cy', cbConfig.brushes[idx].y)
      .attr('r', cbConfig.brushes[idx].r2)
      .style('fill', "lightgreen")

      .call(this.drag);

    clusterBrush.b1= g_.append("svg:circle")
      .attr("class", "cluster_brush cluster_brush_c1")
      .attr('cx', cbConfig.brushes[idx].x)
      .attr('cy', cbConfig.brushes[idx].y)
      .attr('r', cbConfig.brushes[idx].r1)
      .style('fill', "white")

      .call(this.drag);

    clusterBrush.b1handle= g_.append("svg:circle")
      .attr("class", "cluster_brush_handle cbhandle_"+idx+"_"+0)
      .attr('cx', cbConfig.brushes[idx].x+cbConfig.brushes[idx].r1)
      .attr('cy', cbConfig.brushes[idx].y)
      .attr('r', 3)
      .call(this.drag);

    clusterBrush.b2handle= g_.append("svg:circle")
      .attr("class", "cluster_brush_handle cbhandle_"+idx+"_"+1)
      .attr('cx', cbConfig.brushes[idx].x+cbConfig.brushes[idx].r2)
      .attr('cy', cbConfig.brushes[idx].y)
      .attr('r', 3)
      .call(this.drag);


    cbConfig.brushes[idx].brush = clusterBrush;


  };

  this.createClusterBrushes = function (svg_, cbConfig){
    for (var i=0;i<cbConfig.brushes.length;i++) {
      this.createClusterBrush(svg_,cbConfig,i);
    }
  };




  this.createClusterBrushesData = function (g_, data){

    clusterBrushConfig = new VarClusterBrushConfig();
    clusterBrushConfig.init(g_, data);

    for (var i=0;i<data.centroids.length;i++){
      var x_ = clusterBrushConfig.scales.x(data.centroids[i][0]);
      var y_ = clusterBrushConfig.scales.y(data.centroids[i][1]);
      var r_ = clusterBrushConfig.scales.rscale.invert(0.2);
      clusterBrushConfig.position(i, x_, y_, r_ );
    }
  };


  this.start = function(data) {
    this.createClusterBrushesData(this.container, data);
    this.createClusterBrushes(this.container, clusterBrushConfig);
    //init();
  };


}


