/**
 * Created by halil on 22/08/2017.
 */



function VarRadialBrushConfig() {
  this.brushes= [];

  this.scales={
    "rscale":d3.scale.linear().domain([0,1]).range([0,boxWidth/2]),
    "boxxscale":d3.scale.linear().domain([-1,1]).range([0,boxWidth]),
    "boxyscale":d3.scale.linear().domain([-1,1]).range([boxWidth, 0]),
    "xscale":d3.scale.linear().domain([-1,1]).range([-1, 1]),
    "yscale":d3.scale.linear().domain([-1,1]).range([-1, 1])

  };



  this.position = function (idx, x,y, r){
    this.brushes[idx].x = x;
    this.brushes[idx].y = y;
    this.brushes[idx].r1 = r;
    this.brushes[idx].r2 = r*1.1;
  };



  this.init = function(g_, data, var1, var2) {//data:{x:"",y:""}

    console.log(data);
    //find extents
    var extents=[[data.csv[0][var1],data.csv[0][var1]],[data.csv[0][var2],data.csv[0][var2]]];
    for (var k = 1; k < data.csv.length; k++){
      if (+data.csv[k][var1]<extents[0][0])
        extents[0][0] = +data.csv[k][var1];
      if (+data.csv[k][var1]>extents[0][1])
        extents[0][1] = +data.csv[k][var1];

      if (+data.csv[k][var2]<extents[1][0])
        extents[1][0] = +data.csv[k][var2];
      if (+data.csv[k][var2]>extents[1][1])
        extents[1][1] = +data.csv[k][var2];
    }

    //set scales
    this.scales.xscale.domain(extents[0]);
    this.scales.yscale.domain(extents[1]);


    var ss_denom = [0,0];
    for (var k = 0; k < data.csv.length; k++){
      var x_ = this.scales.xscale(data.csv[k][var1]);
      var y_ = this.scales.yscale(data.csv[k][var2]);
      ss_denom[0] = ss_denom[0] + x_ * x_;
      ss_denom[1] = ss_denom[1] + y_ * y_;
    }
    ss_denom[0] = Math.sqrt(ss_denom[0]);
    ss_denom[1] = Math.sqrt(ss_denom[1]);
    data["scaled"]=[];
    for (var k=0;k<data.csv.length;k++) {
      var x_ = this.scales.xscale(data.csv[k][var1]);
      var y_ = this.scales.yscale(data.csv[k][var2]);
      data.scaled.push([x_/ss_denom[0], y_/ss_denom[1]]);
    }
    this.data = data;


    console.log(extents, ss_denom);

    for (var i=0;i<data.scaled.length;i++)
      g_.append("svg:circle")
        .attr("class", "radial_brush ss_point")
        .attr('cx', this.scales.boxxscale(data.scaled[i][0]) )
        .attr('cy', this.scales.boxxscale(data.scaled[i][1]) )
        .attr('r', 2)
        .style('fill', "black")
        ;

  };
}//VarRadialBrushConfig



var VarRadialBrushUtil = function(){
  this.angleBetween2Lines = function (line1,line2)
  {
    var angle1 = Math.atan2(line1.y1 - line1.y2, line1.x1 - line1.x2);
    var angle2 = Math.atan2(line2.y1 - line2.y2, line2.x1 - line2.x2);

    var rad = angle2-angle1;

    if ( rad>Math.PI  && (rad<=(1.5*Math.PI)))
          rad = rad - Math.PI;
    else if ( rad>(-Math.PI/2)  && rad<=0)
      rad = rad + Math.PI ;
    else
      rad = rad - Math.PI ;




    return {"degree": rad* 180 / Math.PI, "radian":rad};
  };

};





function VarRadialBrush(container){
  this.container = container;




  this.cluster_brush_handle_dragstart = function (){

  };

  this.cluster_brush_handle_drag = function (){
    var handleIdx =  $(this).attr("class").indexOf("radial_brush_h1___")>-1?1:2;
    var handleClassName="radial_brush_h"+handleIdx+"___";
    var dimname_idx = $(this).attr("class").substring($(this).attr("class").indexOf(handleClassName)+handleClassName.length).split("_");
    var dimName = dimname_idx[0];
    var idx = +dimname_idx[1];

    var c_cx = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cx");
    var c_cy = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cy");
    var c_r = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("r");

    console.log("clazz",  c_cx,c_cy, d3.event.x,d3.event.y);

    var angle = new VarRadialBrushUtil().angleBetween2Lines(
      {"x1":c_cx,"y1":c_cy, "x2":c_cx,"y2":c_cy+10},
      {"x1":c_cx,"y1":c_cy, "x2":d3.event.x,"y2":d3.event.y}
    );

    var new_cx = c_cx+Math.sin(angle.radian)*c_r;
    var new_cy = c_cy-Math.cos(angle.radian)*c_r;
    console.log("r, x,y", angle.radian,   new_cx, new_cy );

    d3.select("."+handleClassName+dimName+"_"+idx).attr("cx", new_cx);
    d3.select("."+handleClassName+dimName+"_"+idx).attr("cy", new_cy);

  };


  this.cluster_brush_handle_dragend = function (){
  };


  this.radial_brush_arc_dragstart =function (){
    var clazz =  $(this).attr("class");
    var classNamePrefix="radial_brush_b___";
    var dimname_idx = clazz.substring(clazz.indexOf(classNamePrefix)+classNamePrefix.length).split("_");
    var dimName = dimname_idx[0];
    var idx = +dimname_idx[1];

    var c = d3.select(".radial_brush_c___"+dimName+"_"+idx);
    var c_cx = +c.attr("cx");
    var c_cy = +c.attr("cy");
    var c_r = +c.attr("r");


    var mouse_ = d3.mouse(c.node());
    var angle = new VarRadialBrushUtil().angleBetween2Lines(
      {"x1":c_cx,"y1":c_cy, "x2":c_cx,"y2":c_cy-10},
      {"x1":c_cx,"y1":c_cy, "x2":mouse_[0],"y2":mouse_[1]}
    );

    if (angle.radian> -Math.PI && angle.radian<= (-Math.PI/2))
      angle.radian += Math.PI;

    else if (angle.radian> (-2.5 * Math.PI) && angle.radian<= (-2*Math.PI))
      angle.radian += 3*Math.PI;
    else if (angle.radian> (-2 * Math.PI) && angle.radian<= (-1.5*Math.PI))
      angle.radian += Math.PI;
    else
      angle.radian -= Math.PI;



    var datum = d3.select(this).datum();
    datum["dragStartAngle"] = angle;
    d3.select(this).datum(datum);
    console.log("prev.datum",d3.mouse(c.node()), c_cx, c_cy);
  };

  this.radial_brush_arc_drag =function (){
    var clazz =  $(this).attr("class");
    var classNamePrefix="radial_brush_b___";
    var dimname_idx = clazz.substring(clazz.indexOf(classNamePrefix)+classNamePrefix.length).split("_");
    var dimName = dimname_idx[0];
    var idx = +dimname_idx[1];

    var c_cx = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cx");
    var c_cy = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cy");
    var c_r = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("r");

    var angle = new VarRadialBrushUtil().angleBetween2Lines(
      {"x1":c_cx,"y1":c_cy, "x2":c_cx,"y2":c_cy-10},
      {"x1":c_cx,"y1":c_cy, "x2":d3.event.x,"y2":d3.event.y}
    );


    if (angle.radian> -Math.PI && angle.radian<= (-Math.PI/2))
      angle.radian += Math.PI;

    else if (angle.radian> (-2.5 * Math.PI) && angle.radian<= (-2*Math.PI))
      angle.radian += 3*Math.PI;
    else if (angle.radian> (-2 * Math.PI) && angle.radian<= (-1.5*Math.PI))
      angle.radian += Math.PI;
    else
      angle.radian -= Math.PI;


    var startingRadian = d3.select(this).datum().dragStartAngle.radian;

    var newarc = d3.svg.arc()
        .innerRadius(c_r*0.8)
        .outerRadius(c_r*1.2)
        .startAngle(angle.radian - startingRadian) //converting from degs to radians
        .endAngle(angle.radian - startingRadian+0.8)
      ;
    d3.select(".radial_brush_b___"+dimName+"_"+idx).attr("d",newarc);




    var new_cx = c_cx+Math.sin(angle.radian- startingRadian)*c_r;
    var new_cy = c_cy-Math.cos(angle.radian- startingRadian)*c_r;
    d3.select(".radial_brush_h1___"+dimName+"_"+idx).attr("cx", new_cx);
    d3.select(".radial_brush_h1___"+dimName+"_"+idx).attr("cy", new_cy);

    new_cx = c_cx+Math.sin(angle.radian- startingRadian+0.8)*c_r;
    new_cy = c_cy-Math.cos(angle.radian- startingRadian+0.8)*c_r;
    d3.select(".radial_brush_h2___"+dimName+"_"+idx).attr("cx", new_cx);
    d3.select(".radial_brush_h2___"+dimName+"_"+idx).attr("cy", new_cy);
    return;

  };

  this.radial_brush_arc_dragend =function (){

  };


  this.drag = d3.behavior.drag()
    .on('dragstart', this.cluster_brush_handle_dragstart)
    .on('drag', this.cluster_brush_handle_drag)
    .on('dragend', this.cluster_brush_handle_dragend);


  this.arcdrag = d3.behavior.drag()
    .on('dragstart', this.radial_brush_arc_dragstart)
    .on('drag', this.radial_brush_arc_drag)
    .on('dragend', this.radial_brush_arc_dragend);



  this.createRadialBrush = function (g_, cbConfig, dimName, idx){//cb:cluster brush
    // var cb = cbConfig.brushes[idx];
    // var x  = cb.x;
    // var y = cb.y;
    // var r1 = cb.r1;
    // var r2 = cb.r2;

    var clusterBrush = {"c":null,"h1":null, "h2":null, "b":null}; //circle, handle1 (small circle), handle2 (small circle), brush (circle)

    var c_cx = this.cfg.scales.boxxscale(0);
    var c_cy = this.cfg.scales.boxyscale(0);
    var c_r = this.cfg.scales.rscale(0.75);
    clusterBrush.c= g_.append("svg:circle")
      .attr("class", "radial_brush radial_brush_c radial_brush_c___"+dimName+"_"+idx)
      .attr('cx', c_cx)
      .attr('cy', c_cy)
      .attr('r', c_r)
      .style('fill', "none")
      .style('stroke-width', 1)
      .style('stroke', "black");


    var h_r = 5;
    clusterBrush.h1= g_.append("svg:circle")
      .attr("class", "radial_brush radial_brush_h1 radial_brush_h1___"+dimName+"_"+idx)
      .attr('cx', c_cx+Math.sin(0)*c_r)
      .attr('cy', c_cy-Math.cos(0)*c_r)
      .attr('r', h_r)
      .style('fill', "black")
    .call(this.drag);

    clusterBrush.h2= g_.append("svg:circle")
      .attr("class", "radial_brush radial_brush_h2 radial_brush_h2___"+dimName+"_"+idx)
      .attr('cx', c_cx+Math.sin(0.8)*c_r)
      .attr('cy', c_cy-Math.cos(0.8)*c_r)
      .attr('r', h_r)
      .style('fill', "black")

      .call(this.drag);

    // clusterBrush.h2= g_.append("svg:circle")
    //   .attr("class", "radial_brush radial_brush_b radial_brush_b___"+dimName+"_"+idx)
    //   .attr('cx', c_cx+Math.cos(.4)*c_r)
    //   .attr('cy', c_cy-Math.sin(.4)*c_r)
    //   .attr('r', h_r)
    //   .style('fill', "none")
    //   .style('stroke', "black")
    //   .style('stroke-width', 0.5)
    //   .call(this.drag);


    var arc = d3.svg.arc()
      .innerRadius(c_r*0.8)
      .outerRadius(c_r*1.2)
      .startAngle(0) //converting from degs to radians
      .endAngle(0.8)
      ;

    clusterBrush.b = g_.append("path")
      .attr("d", arc)
      .datum({"startAngle":0, "endAngle":0.8})
      .attr("class", "radial_brush radial_brush_b radial_brush_b___"+dimName+"_"+idx)

      .attr("transform", "translate("+c_cx+","+c_cy+")")
      .call(this.arcdrag);
  };


  this.createRadialBrushData = function (g_, data, var1, var2){
    this.cfg = new VarRadialBrushConfig();
    this.cfg.init(g_, data, var1, var2);
  };



  this.start = function(data, var1, var2) {
    this.createRadialBrushData(this.container, data, var1, var2);
    this.createRadialBrush(this.container, this.radialBrushConfig, "abc", 0);
  };


}


