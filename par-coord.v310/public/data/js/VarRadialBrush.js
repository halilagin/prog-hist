/**
 * Created by halil on 22/08/2017.
 */



function VarRadialBrushConfig() {
  this.brushes= [];
  this.brushCircleRadius=0.80;
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



  this.find_angle = function(c_, p0_,p1_) {

     var f = function(c, p0, p1) {
      var p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) +
        Math.pow(c.y - p0.y, 2)); // p0->c (b)
      var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) +
        Math.pow(c.y - p1.y, 2)); // p1->c (a)
      var p0p1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) +
        Math.pow(p1.y - p0.y, 2)); // p0->p1 (c)

      var d = (p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c);

      var rad = 0;
      try {
        rad = Math.acos(d);
      }catch (err){
        rad =0;
        console.log("err:", err);
      }
      if (isNaN(rad)) {
        rad =0;
        console.log("isNaN(rad)==true!!!");
      }

      return [d,rad];
    };
    var rad1 = f(c_, p0_, p1_);
    var rad2 = f(  c_,{"x":-p0_.y, "y":p0_.x},p1_  ); //perpendicular to c,p0,p1

    var quad1 = (rad1[1]>=0 && rad1[1]<Math.PI/2)       && (rad2[1]>=Math.PI/2 && rad2[1]<Math.PI);
    var quad2 = (rad1[1]>=Math.PI/2 && rad1[1]<Math.PI) && (rad2[1]>=Math.PI/2 && rad2[1]<Math.PI);
    var quad3 = (rad1[1]>=Math.PI/2 && rad1[1]<Math.PI) && (rad2[1]>=0 && rad2[1]<Math.PI/2);
    var quad4 = (rad1[1]>=0 && rad1[1]<Math.PI/2)       && (rad2[1]>=0 && rad2[1]<Math.PI/2);


    var rad=0;
    if (quad1 || quad2)
        rad = rad1[1];//[1] -> radian value
    else  //if (quad3 || quad4)
      rad =  -rad1[1] +  2*Math.PI;


    return {"degree": rad * 180 / Math.PI, "radian":rad};
  }

};


var VarRadialBrushConf = {
  "arcLength":0.8,
  "markBrushedLinesCB":()=>{}
};
var RadialBrushSelectedPointIndexes = {};


function VarRadialBrush(container){
  this.container = container;

  this.brushCircleRadius = 0.80;

  this.radial_brush_arc_dragstart =function (){

    var clazz =  $(this).attr("class");
    var classNamePrefix="radial_brush_b___";
    var varspair = clazz.substring(clazz.indexOf(classNamePrefix)+classNamePrefix.length);
    var dimName = varspair.substring(0, varspair.lastIndexOf("_"));
    var idx = +varspair.substring(varspair.lastIndexOf("_")+1);

    var datum = d3.select(this).datum();


    var c = d3.select(".radial_brush_c___"+dimName+"_"+idx);
    var c_cx = +c.attr("cx");
    var c_cy = +c.attr("cy");
    var c_r = +c.attr("r");


    var mouse_ = d3.mouse(c.node());
    var angle =null;


    var initialRadian = 0;
    //if this is the first time of drag start, take vertical axis as the starting point of arc and estimate the angle accordingly
    if (datum["dragStartInfo"]==undefined || datum["dragStartInfo"]==null) {
        initialRadian=0;
    } else {//if this is not the first time, take last mouse position as the starting point of arc and estimate the angle accordingly
      initialRadian = datum.dragStartInfo.initialRadian;
    }

    datum["dragStartInfo"] = {"startAngle":angle,"startingMouse":mouse_, "mouse":mouse_, "initialRadian":initialRadian, "lastRadian":0, "arcLength":VarRadialBrushConf.arcLength};
    d3.select(this).datum(datum);
  };

  this.radial_brush_arc_drag =function (){
    var clazz =  $(this).attr("class");
    var classNamePrefix="radial_brush_b___";
    var varspair = clazz.substring(clazz.indexOf(classNamePrefix)+classNamePrefix.length);
    var dimName = varspair.substring(0, varspair.lastIndexOf("_"));
    var idx = +varspair.substring(varspair.lastIndexOf("_")+1);



    var c = d3.select(".radial_brush_c___"+dimName+"_"+idx);
    var c_cx = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cx");
    var c_cy = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("cy");
    var c_r = +d3.select(".radial_brush_c___"+dimName+"_"+idx).attr("r");

    var datum = d3.select(this).datum();
    var mouse_ = d3.mouse(c.node());


    var dragStartInfo = d3.select(this).datum().dragStartInfo;

    var points = [
      {"x":0,"y":0},
      {"x":dragStartInfo.startingMouse[0]-c_cx, "y":-dragStartInfo.startingMouse[1]+c_cy},
      {"x":mouse_[0]-c_cx, "y":-mouse_[1]+c_cy}
      ];

    var angle = new VarRadialBrushUtil().find_angle(
      points[0],//center
      points[1],
      points[2]
      );
    var startRadian = (angle.radian+datum.dragStartInfo.initialRadian);
    var endRadian = startRadian +  (datum.dragStartInfo.arcLength!=undefined?datum.dragStartInfo.arcLength:VarRadialBrushConf.arcLength);
    var newarc = d3.svg.arc()
        .innerRadius(c_r*0.8)
        .outerRadius(c_r*1.2)
        .startAngle(startRadian ) //converting from degs to radians
        .endAngle(endRadian)
      ;
    d3.select(".radial_brush_b___"+dimName+"_"+idx).attr("d",newarc);

    var new_cx = c_cx+Math.sin(startRadian)*c_r;
    var new_cy = c_cy-Math.cos(startRadian)*c_r;
    d3.select(".radial_brush_h1___"+dimName+"_"+idx).attr("cx", new_cx);
    d3.select(".radial_brush_h1___"+dimName+"_"+idx).attr("cy", new_cy);

    new_cx = c_cx+Math.sin(endRadian)*c_r;
    new_cy = c_cy-Math.cos(endRadian)*c_r;
    d3.select(".radial_brush_h2___"+dimName+"_"+idx).attr("cx", new_cx);
    d3.select(".radial_brush_h2___"+dimName+"_"+idx).attr("cy", new_cy);

    datum["dragStartInfo"].lastRadian = startRadian;//save last radian, when the radial brush done second time, start from here.
    datum["dragStartInfo"].arcLength = endRadian - startRadian;
    d3.select(this).datum(datum);
    return;

  };



  this.radial_brush_arc_dragend =function (){
    var moduloPI = function(v){

      while(v>2*Math.PI)
        v-=2*Math.PI;
      return v;
    };

    var radialBrushPanelClass = $(this).parent().attr("class");
    var radialBrushPanelClass_ = radialBrushPanelClass.substring(radialBrushPanelClass.indexOf("radialbrush_panel_")+"radialbrush_panel_".length);
    var radialBrushPanelDimName = radialBrushPanelClass_.substring(0, radialBrushPanelClass_.lastIndexOf("_"));
    var radialBrushPanelDimIdx = +radialBrushPanelClass_.substring(radialBrushPanelClass_.lastIndexOf("_")+1);



    var datum = d3.select(this).datum();
    datum["dragStartInfo"].initialRadian = datum["dragStartInfo"].lastRadian;//save last radian, when the radial brush done second time, start from here.
    d3.select(this).datum(datum);

    var clazz =  $(this).attr("class");
    var classNamePrefix="radial_brush_b___";
    var varspair = clazz.substring(clazz.indexOf(classNamePrefix)+classNamePrefix.length);
    var dimName = varspair.substring(0, varspair.lastIndexOf("_"));
    var idx = +varspair.substring(varspair.lastIndexOf("_")+1);


    var circleDatum = d3.select(".radial_brush_c___"+dimName+"_"+idx).datum();
    var arcLength = VarRadialBrushConf.arcLength;
    for( var i=0;i<circleDatum.pointSize;i++) {
      d3.select(".ss_"+dimName+"_point_"+i).classed("ss_point_active", false);
    }

    // if (RadialBrushSelectedPointIndexes[radialBrushPanelDimName]==undefined || RadialBrushSelectedPointIndexes[radialBrushPanelDimName]==null) {
    //   RadialBrushSelectedPointIndexes[radialBrushPanelDimName] = [];
    // }


    RadialBrushSelectedPointIndexes[radialBrushPanelDimName]=[];
    for( var i=0;i<circleDatum.pointSize;i++) {
      var cls_ = ".ss_"+dimName+"_point_"+i;
      var p = d3.select(cls_);
      var r = p.datum().radian;


      r = moduloPI(r);
      var lower = moduloPI(datum["dragStartInfo"].initialRadian);
      var higher = moduloPI( datum["dragStartInfo"].initialRadian + arcLength );


      var isActive=false;
      if (higher>lower) {//normal scenario
        if (r >= lower && r < higher)
          isActive = true;
      } else {// when r is 3.00 but range is between 2.80 and 0.2. split it 2.80<->Math.PI and 0<->0.2
        if ((r >= lower && r < 2*Math.PI) ||  (r >= 0 && r < higher) )
          isActive = true;
      }

      if (isActive) {
        p.classed("ss_point_active", true);
        RadialBrushSelectedPointIndexes[radialBrushPanelDimName].push(i);
      }
    }


    console.log("radial_brush_arc_dragend", RadialBrushSelectedPointIndexes );

    var dimidx = {"dim":dimName.split("___")[1],"idx":idx};
    VarRadialBrushConf.markBrushedLinesCB(dimidx);
  };


  this.drag = d3.behavior.drag()
    .on('dragstart', this.cluster_brush_handle_dragstart)
    .on('drag', this.cluster_brush_handle_drag)
    .on('dragend', this.cluster_brush_handle_dragend);


  this.arcdrag = d3.behavior.drag()
    .on('dragstart', this.radial_brush_arc_dragstart)
    .on('drag', this.radial_brush_arc_drag)
    .on('dragend', this.radial_brush_arc_dragend);



  this.projectPointsOnCircle = function (g_, data, dimName, center) {
      for (var i=0;i<data[0].length;i++) {
        var x_ = this.cfg.scales.boxxscale(data[0][i] * this.brushCircleRadius);
        var y_ = this.cfg.scales.boxyscale(data[1][i] * this.brushCircleRadius);
        var points = [
          {"x":center[0], "y":center[1] },

          {"x":center[0], "y":center[1]-10 },
          {"x":x_, "y":y_ }
        ];

        var angle =  new VarRadialBrushUtil().find_angle(points[0],points[1],points[2]);
        g_.append("svg:circle")
          .datum({"radian":angle.radian, "index":i})
          .attr("class", ("radial_brush ss_point ss_" + dimName + "_point_" + i))
          .attr('cx',x_) //multiply with brushCircleRadius to project on circle.
          .attr('cy', y_)
          .attr('r', 2)
          .style('fill', "black")
        ;
      }
  };


  this.createRadialBrush = function (data, g_, cbConfig, dimName, idx){//cb:cluster brush
    this.cfg = new VarRadialBrushConfig();


    var clusterBrush = {"c":null,"h1":null, "h2":null, "b":null}; //circle, handle1 (small circle), handle2 (small circle), brush (circle)

    var c_cx = this.cfg.scales.boxxscale(0);
    var c_cy = this.cfg.scales.boxyscale(0);
    var c_r = this.cfg.scales.rscale(this.brushCircleRadius);
    clusterBrush.c= g_.append("svg:circle")
      .attr("class", "radial_brush radial_brush_c radial_brush_c___"+dimName+"_"+idx)
      .attr('cx', c_cx)
      .attr('cy', c_cy)
      .attr('r', c_r)
      .style('fill', "none")
      .style('stroke-width', 1)
      .style('stroke', "black");

    clusterBrush.c.datum({"pointSize":data[0].length});

    this.projectPointsOnCircle(g_, data, dimName, [c_cx, c_cy]);


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



  this.start = function(data, dimName, markBrushedLinesCB) {
    this.data= data;
    VarRadialBrushConf.markBrushedLinesCB = markBrushedLinesCB;
    this.createRadialBrush(data, this.container, this.radialBrushConfig,dimName, 0);
  };


}


