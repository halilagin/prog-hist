import React, {Component} from 'react';
import * as d3 from 'd3';
import * as axios from 'axios';


class StreamedDataContext extends Component {
  bins=null;
  binchanges=null;
  histogramData =null;
  streamedData=null
}


export class ProgHistAnnotatedBins extends Component {
  CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
  CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]

  visible=true;
  streamedDataContext=null;
  userData = {clicks:[], binCountGuess:0, cost:0, startTime:-1};
  histType=null;
  // changes array has 3 elements. first indicates changes between 2 bins,
  // second indicates change in first bin and the last shows changes in second bin.
  // example
  // "BECOMING_FAR" : two bins become for away from each other.
  // 1: "SPLITTING" : first bins splits
  // 2: "SUPPORTS_CONCEPT" : second bin support the concept. namely, preserve the ration between its accompanying bin.

  setStream(data){
    if (this.streamedDataContext==null)
      this.streamedDataContext = new StreamedDataContext()
    this.streamedDataContext.bins = data.bins
    this.streamedDataContext.binchanges = data.binchanges
    this.streamedDataContext.histogramData=data.histogramData
    this.streamedDataContext.streamedData=data.streamedData
    console.log("streamed data context", this.streamedDataContext);

  }


  /*
   <div style={{display:this.getDisplay()}}>
   <div className="ProgHistMainContainer">
   <div>
   <div> Guess for number of gaussians</div>
   <div><input ref="txtBinCountGuess" defaultValue={this.userData.binCountGuess} />
   <button key="setGuessOfGaussCount"  onClick={this.setGuessOfGaussCount.bind(this)} >OK</button>
   </div>
   </div>
   <div className="ph_bincountdiv">
   <div>Bins Count</div>
   <div className="ph_bincount_txt_cntr">
   <input ref="txtBinsCount" defaultValue={this.state.binsCount} className="ph_bincount" />
   </div>
   <div className="ph_bincount_updown_cntr">
   <div><span className="glyphicon glyphicon-chevron-up"  onClick={this.increaseBinCount.bind(this)}></span></div>
   <div><span className="glyphicon glyphicon-chevron-down" onClick={this.decreaseBinCount.bind(this)}></span></div>
   </div>
   </div>
   <div className="ph_clear"> </div>

   <div className="interval_cntr">Interval <input ref="txtInterval" defaultValue={this.state.interval} />ms <button key="start"   onClick={this.startTimer.bind(this)} >Start</button></div>
   <div className="ph_buttons">
   <div className="ph_buttonitem"> <button key="start"   onClick={this.stopTimer.bind(this)} >Stop</button></div>
    <div className="ph_buttonitem"><button key="refresh"  onClick={this.refresh.bind(this)} >Refresh</button></div>
    </div>
    </div>

<div className="histscontainer">
  <div className="svgcontainer">

  </div>
  <div className="classic_histbar_svgcontainer">

  </div>
  </div>
  <div id="userevaluation">

  </div>
  </div>
  */

    render() {


        return (
          <div style={{display:this.getDisplay()}}>
            <div className="ProgHistMainContainer">
                <div style={{display:"none"}}>
                  <div> Guess for number of gaussians</div>
                  <div><input ref="txtBinCountGuess" defaultValue={this.userData.binCountGuess} />
                    <button key="setGuessOfGaussCount"  onClick={this.setGuessOfGaussCount.bind(this)} >OK</button>
                  </div>
                </div>

                <div className="ph_clear"> </div>

                <div className="interval_cntr" style={{display:"none"}}>Interval <input ref="txtInterval" defaultValue={this.state.interval} />ms <button key="start"   onClick={this.startTimer.bind(this)} >Start</button></div>
                <div className="ph_buttons">
                  {/*<div className="ph_buttonitem"> <button key="start"   onClick={this.stopTimer.bind(this)} >Stop</button></div>*/}
                  {/*<div className="ph_buttonitem"> <button key="generateData"   onClick={this.generateData.bind(this)} >generateData</button></div>*/}
                  {/*<div className="ph_buttonitem"><button key="refresh"  onClick={this.refresh.bind(this)} >Refresh</button></div>*/}

                  <div>
                    <div className="ph_buttonitem"> <button key="start"   onClick={this.toggleStopStart.bind(this)} >{this.getStopStartButtonText()}</button></div>

                    <div className="ph_bincountdiv">
                      <div >
                        <div className="ph_bincount_txt_cntr" >
                          <input ref="txtBinsCount" defaultValue={this.state.binsCount} className="ph_bincount" />
                        </div>
                      </div>
                      <div className="ph_bincount_updown_cntr">
                        <div><span className="glyphicon glyphicon-chevron-up"  onClick={this.increaseBinCount.bind(this)}></span></div>
                        <div>bins</div>
                        <div><span className="glyphicon glyphicon-chevron-down" onClick={this.decreaseBinCount.bind(this)}></span></div>
                      </div>
                    </div>
                    <div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>0</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>1</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>2</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>3</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>4</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>5</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>6</span></div>
                      <div style={{float:"left", margin:"5px"}} className="btn btn-primary"><span>7</span></div>

                    </div>
                  </div>
                </div>
            </div>

            <div className="histscontainer">
              <div className="svgcontainer">

              </div>
              <div className="classic_histbar_svgcontainer">

              </div>
            </div>
            <div id="userevaluation">

            </div>
          </div>
        );
    }


  show(){
    this.state.visible = true;

  }
  hide(){
    this.state.visible = false;
  }

  toggleDisplay(){
      this.state.visible = !this.state.visible;
      this.setState(this.state);
  }

  getDisplay(){
    return this.state.visible?"block":"none";
  }

  getStopStartButtonText(){
    return this.state.stopStart?"Stop":"Start";
  }

  toggleStopStart(){
    this.state.stopStart = !this.state.stopStart;
    this.setState(this.state);
    if (this.state.stopStart)
      this.startTimer();
    else
      this.stopTimer();
  }

    refresh(){
        this.stopTimer();
        this.state.canvas.selectAll("*").remove();
        this.state.canvas=null;
        d3.selectAll("svg").remove();
        this.initData();
        this.start();
    }


  setGuessOfGaussCount(){
    this.userData.binCountGuess = this.refs.txtBinCountGuess.value;

    let url = "http://localhost:5000/proghist/streaming/saveuserdata";

    axios.post(url, this.userData)
      .then((resp) => {
        alert("user data submitted. thanks!");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  increaseBinCount(){
    if (this.userData.clicks.length==0){
      this.userData.startTime = new Date().getTime();
    }

    this.stopTimer();
    this.state.binsCount +=1;
    this.userData.clicks.push({time:new Date().getTime() - this.userData.startTime, upDown:'up', binCount:this.state.binsCount});
    this.refs.txtBinsCount.value = this.state.binsCount;
    this.setState(this.state);
    this.start();

  }

  decreaseBinCount(){
    if (this.userData.clicks.length==0){
      this.userData.startTime = new Date().getTime();
    }

    this.stopTimer();
    this.state.binsCount -=1;
    this.userData.clicks.push({time:new Date().getTime() - this.userData.startTime, upDown:'down',binCount:this.state.binsCount});
    this.refs.txtBinsCount.value = this.state.binsCount;
    this.setState(this.state);
    this.start();
  }


    setInterval(){
        let newInterval = this.refs.txtInterval.value;
        this.state.interval =newInterval;

    }
    setBinsCount(){
        let bc = this.refs.txtBinsCount.value;
        this.state.binsCount = parseInt(bc);
    }

    startTimer(){
        this.setInterval();
        this.setBinsCount();

        if (this.state.timer!=null)
            clearInterval(this.state.timer);
        this.start();
    }


    stopTimer(){
        if (this.state.timer!=null)
            clearInterval(this.state.timer);
        this.state.timer=null;
    }




    start(){
        let timeInterval=1000;
        if (this.state!=null && this.state.interval!=null)
            timeInterval = this.state.interval;



        if (this.histType=="AnnotatedHistogram" && this.state.canvas==null)
            this.state.canvas = d3.select(".svgcontainer").append("svg")
                .attr("class", "svg_container")
                .attr("width", this.state.width)
                .attr("height",this.state.height+this.state.padding)
                .append("g")
                .attr("transform", "translate(20,20)")
                ;



      if ( this.histType=="ClassicHistogram" && this.state.classicHistCanvas==null)
        this.state.classicHistCanvas = d3.select(".classic_histbar_svgcontainer").append("svg")
          .attr("class", "classic_histbar_svgcontainer")
          .attr("width", this.state.width)
          .attr("height",this.state.height+this.state.padding)
          .append("g")
          .attr("transform", "translate(20,20)")
        ;
      this.setState(this.state);


      this.state.timer = setInterval(()=>{this.loopDrawingProgHist();}
            ,timeInterval);
    }



  loopDrawingProgHist(){

    console.log("streamingDataIdx", this.state.streamingDataIdx);
    let hist = d3.layout.histogram();

    let url = "http://localhost:5000/proghist/streaming/createdata?bincount="+this.refs.txtBinsCount.value+"&idx="+this.state.streamingDataIdx;
    axios.get(url)
      .then((resp) => {
        this.setStream(resp.data);
        console.log("data stream created, this.state.binsCount ", this.state.binsCount );

        if (this.histType=="AnnotatedHistogram")
          this.drawBins(hist);

        if (this.histType=="ClassicHistogram")
          this.drawClassicHistBins(d3.layout.histogram());

        this.state.streamingDataIdx = this.state.streamingDataIdx +1;
        this.setState(this.state);

      });


  }






  drawBins(hist ) {
    this.state.canvas.selectAll("*").remove();
    this.state.canvas.append("text")
      .attr("x", d => this.state.width / 2 - 20)
      .attr("y", d => this.state.height + this.state.padding * 0.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .text("prog-hist-annotated");

    console.log("bin.changes", this.streamedDataContext.binchanges);

    var sx = d3.scale.linear()
      .domain([0, d3.max(this.streamedDataContext.histogramData)])
      .range([0, this.state.width * 0.9]);
    var sy = d3.scale.linear()
      .domain([0, d3.max(this.streamedDataContext.bins.map(d => d.size))])
      .range([0, this.state.height * 0.75]);
    //this.getBins(5,this.this.ages);



    let gXaxis = d3.svg.axis().scale(sx).orient("bottom");
    this.state.canvas.append("g").style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
      .call(gXaxis)
      .attr("transform", "translate(-5," + (this.state.height + 5) + ")");
      //between bins : ["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]. zeroth index stores the change between bins



    //CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
    //CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
    let bins = this.streamedDataContext.bins;
    let changesInNewStreamedData = this.streamedDataContext.binchanges;

    for (let idx=0;idx<bins.length;idx++) {

      //draw left line
      if (idx == 0) {
        this.drawVerLeftLine(this.state.canvas, bins, idx, sx, sy);
        this.drawBarHorLeftLine(bins, idx, sx, sy,changesInNewStreamedData);
      } else if (idx == changesInNewStreamedData.length) {
        if (changesInNewStreamedData[idx - 1][0] == "BECOMING_FAR") {
          this.drawRightBezierLine(bins, idx, sx, sy, changesInNewStreamedData, idx-1);
          //this.drawRightBezierLine(bins, idx, sx, sy,changesInNewStreamedData);
        } else if (changesInNewStreamedData[idx - 1][0] == "MERGING") {
          this.drawMergeLeftLine(bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy,changesInNewStreamedData);
        } else {
          this.drawVerLeftLine(this.state.canvas, bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy,changesInNewStreamedData);
        }

      } else {
        if (changesInNewStreamedData[idx - 1][0] == "BECOMING_FAR") {
          this.drawRightBezierLine(bins, idx, sx, sy,changesInNewStreamedData, idx-1);
          //this.drawRightBezierLine(bins, idx, sx, sy,changesInNewStreamedData);

        } else if (changesInNewStreamedData[idx - 1][0] == "MERGING") {
          this.drawMergeLeftLine(bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy,changesInNewStreamedData);
        } else {
          this.drawVerLeftLine(this.state.canvas, bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy,changesInNewStreamedData);
        }
      }

      //draw right line
      if (idx == changesInNewStreamedData.length) {
        this.drawVerRightLine(this.state.canvas, bins, idx, sx, sy);
        this.drawBarHorRightLine(bins, idx, sx, sy, changesInNewStreamedData);
      } else if (idx == 0) {
        if (changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
          this.drawLeftBezierLine(bins, idx, sx, sy, changesInNewStreamedData );
        } else if (changesInNewStreamedData[idx][0] == "MERGING") {
          this.drawMergeRightLine(bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy, changesInNewStreamedData);
        } else {
          this.drawVerRightLine(this.state.canvas, bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy, changesInNewStreamedData);
        }


      } else {
        if (changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
          this.drawLeftBezierLine(bins, idx, sx, sy, changesInNewStreamedData);
        } else if (changesInNewStreamedData[idx][0] == "MERGING") {
          this.drawMergeRightLine(bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy, changesInNewStreamedData);
        } else {
          this.drawVerRightLine(this.state.canvas, bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy, changesInNewStreamedData);
        }
      }

      //this.drawBarHorLeftLine(bins, idx, sx, sy);
      //this.drawBarHorRightLine(bins, idx, sx, sy);


      if (idx < changesInNewStreamedData.length && changesInNewStreamedData[idx][1] == "SPLITTING") {
        this.drawCrack(bins, idx, sx, sy);
      } else { //SUPPORTS_CONCEPT

      }

      if (idx < changesInNewStreamedData.length && changesInNewStreamedData[idx][2] == "SPLITTING") {
        this.drawCrack(bins, idx + 1, sx, sy);
      } else { //SUPPORTS_CONCEPT

      }

      //this.drawBoxplots(bins, idx, sx, sy, this.state.height, "red");
    }


  }




  drawBarHorizontalLine(canvas, bins, idx, sx,sy) {
    canvas.selectAll(".histhorline"+idx)
      .data([bins[idx]])
      .enter()
      .append("line")
      .classed("histhorline"+idx, true)
      .attr("x1", d => sx(d.x))
      .attr("y1", d => this.state.height - sy(d.y) + 5)
      .attr("x2", d => {
        return sx(d.x + d.dx - d.dx / 20.0)
      })
      .attr("y2", d => this.state.height - sy(d.y) + 5)
      .attr("fill", "none")
      .attr("stroke", "#33aade")
      .attr("stroke-width", "2");
  }

  drawBarHorLeftLine(bins, idx, sx,sy,changesInNewStreamedData) {
    this.state.canvas.selectAll(".histhorlineleft"+idx)
      .data([bins[idx]])
      .enter()
      .append("line")
      .classed("histhorlineleft"+idx, true)
      .attr("x1", d => sx(d.x))
      .attr("y1", d => this.state.height - sy(d.y) + 5)
      .attr("x2", d => {
        let or_1 = (idx>-1 && idx<changesInNewStreamedData.length) && changesInNewStreamedData[idx][1]=="SPLITTING";
        let or_2 = ((idx-1)>-1 && (idx-1)<changesInNewStreamedData.length) && changesInNewStreamedData[idx-1][2]=="SPLITTING";
        return  (or_1 || or_2)? sx(d.x + d.dx/2.0 - d.dx/20) : sx(d.x + d.dx/2.0);

      })
      .attr("y2", d => this.state.height - sy(d.y) + 5)
      .attr("fill", "none")
      .attr("stroke", "#33aade")
      .attr("stroke-width", "2");
  }

  drawBarHorRightLine(bins, idx, sx,sy,changesInNewStreamedData) {


    this.state.canvas.selectAll(".histhorlineright"+idx)
      .data([bins[idx]])
      .enter()
      .append("line")
      .classed("histhorlineright"+idx, true)
      .attr("x1", d => {

        let or_1 = (idx>-1 && idx<changesInNewStreamedData.length) && changesInNewStreamedData[idx][1]=="SPLITTING";
        let or_2 = ((idx-1)>-1 && (idx-1)<changesInNewStreamedData.length) && changesInNewStreamedData[idx-1][2]=="SPLITTING";
        return  (or_1 || or_2)? sx(d.x + d.dx/2.0 + d.dx/20) : sx(d.x + d.dx/2.0);
      })
      .attr("y1", d => this.state.height - sy(d.y) + 5)
      .attr("x2", d => {
        return sx( d.x + d.dx - d.dx / 20.0)
      })
      .attr("y2", d => this.state.height - sy(d.y) + 5)
      .attr("fill", "none")
      .attr("stroke", "#33aade")
      .attr("stroke-width", "2");
  }








  drawVerRightLine(canvas, bins, idx, sx, sy){
    var histverlineG2 = canvas.selectAll(".histverlineright"+idx)
        .data([bins[idx]])
        .enter()
        .append("line")
        .attr("class", (d, i) => "histverlineright"+idx)
        .attr("x1", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y1", (d, i) => this.state.height+5)
        .attr("x2", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y2", (d, i) => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", (d, i) => "#33aade")
        .attr("stroke-width", (d, i) => "2")
      ;
    return histverlineG2;
  }






  drawRightBezierLine(bins, idx, sx,sy, changesInNewStreamedData, change_idx){

    let endPoint=0;
    //let changesArray = changesInNewStreamedData[idx];

    let or_1 = (idx>-1 && idx<changesInNewStreamedData.length) && changesInNewStreamedData[idx][1]=="SPLITTING";
    let or_2 = ((idx-1)>-1 && (idx-1)<changesInNewStreamedData.length) && changesInNewStreamedData[idx-1][2]=="SPLITTING";
    console.log(change_idx+":"+or_1+":"+ or_2);
    endPoint = (or_1 || or_2)? (bins[idx].x+bins[idx].dx/2.0-bins[idx].dx/20.0) : (bins[idx].x+bins[idx].dx/2.0);



    let curvedata = [
      [sx(bins[idx].x), this.state.height+5],
      [sx(bins[idx].x)+bins[idx].dx/3.0,this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx/2.5), this.state.height - sy(bins[idx].y)+5],
      [sx(endPoint), this.state.height - sy(bins[idx].y)+5]
    ];


    var bezierLine = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; })
      .interpolate("basis");

    var leanleft = this.state.canvas
      .append('path')
      .attr("d", bezierLine(curvedata))
      .attr("stroke", "#33aade")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }


  drawLeftBezierLine(bins, idx, sx,sy, changesInNewStreamedData){
    let endPoint=0;
    let or_1 = (idx>-1 && idx<changesInNewStreamedData.length) && changesInNewStreamedData[idx][1]=="SPLITTING";
    let or_2 = ((idx-1)>-1 && (idx-1)<changesInNewStreamedData.length) && changesInNewStreamedData[idx-1][2]=="SPLITTING";

    endPoint = or_1 || or_2 ? (bins[idx].x+bins[idx].dx/2.0+bins[idx].dx/20.0) : (bins[idx].x+bins[idx].dx/2.0);


    let curvedata = [
      [sx(bins[idx].x+bins[idx].dx) - 5, this.state.height+5],
      [sx(bins[idx].x+bins[idx].dx - bins[idx].dx/20.0)-5, this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx - bins[idx].dx/6.0)-5, this.state.height - sy(bins[idx].y)+5],
      [sx(endPoint), this.state.height - sy(bins[idx].y)+5]
    ];


    var bezierLine = d3.svg.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; })
      .interpolate("basis");

    var leanleft = this.state.canvas
      .append('path')
      .attr("d", bezierLine(curvedata))
      .attr("stroke", "#33aade")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }

    drawBoxplots(bins, idx, sx,sy,height, color){

      this.state.canvas.selectAll(".boxplot"+idx)
        .data([bins[idx]])
        .enter()
        .append("line")
        .attr("class","boxplot")
        .attr("x1", (d,i)=>sx(d.x+d.dx/2))
        .attr("y1", (d,i)=>height-sy(d.y))
        .attr("x2", (d,i)=>sx(d.x+d.dx/2))
        .attr("y2", (d,i)=>height-sy(d.y)+10)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", "1")
        ;

      // this.state.canvas.selectAll(".boxplottop"+idx)
      //   .data([bins[idx]])
      //   .enter()
      //   .append("line")
      //   .attr("class","boxplottop")
      //   .attr("x1", (d,i)=>sx(d.x+d.dx/2)-2)
      //   .attr("y1", (d,i)=>height-sy(d.y))
      //   .attr("x2", (d,i)=>sx(d.x+d.dx/2)+2)
      //   .attr("y2", (d,i)=>height-sy(d.y))
      //   .attr("fill", "none")
      //   .attr("stroke", color)
      //   .attr("stroke-width", "1")
      //   ;
      //
      // this.state.canvas.selectAll(".boxplotbottom"+idx)
      //   .data([bins[idx]])
      //   .enter()
      //   .append("line")
      //   .attr("class","boxplotbottom")
      //   .attr("x1", (d,i)=>sx(d.x+d.dx/2)-2)
      //   .attr("y1", (d,i)=>height-sy(d.y)+10)
      //   .attr("x2", (d,i)=>sx(d.x+d.dx/2)+2)
      //   .attr("y2", (d,i)=>height-sy(d.y)+10)
      //   .attr("fill", "none")
      //   .attr("stroke", color)
      //   .attr("stroke-width", "1")
      //   ;


    }




  drawVerLeftLine(canvas, bins, idx, sx, sy){
    var histverlineG1 = canvas.selectAll(".histverlineleft"+idx)
        .data([bins[idx]])
        .enter()
        .append("line")
        .attr("class", (d, i) => "histverlineleft"+idx)
        .attr("x1", (d, i) => sx(d.x))
        .attr("y1", (d, i) =>  this.state.height+5)
        .attr("x2", (d, i) =>  sx(d.x))
        .attr("y2", (d, i) => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", (d, i) => "#33aade")
        .attr("stroke-width", (d, i) => 2 )
      ;
    return histverlineG1;
  }

    drawMergeLeftLine(bins, idx, sx, sy){
      let minY = bins[idx].y;


      if (bins[idx-1].y<minY )
        minY = bins[idx-1].y;

      var histverlineG1 = this.state.canvas.selectAll(".histverlineleft"+idx)
          .data([bins[idx]])
          .enter()
          .append("line")
          .attr("class", (d, i) => "histverlineleft"+idx)
          .attr("x1", (d, i) => sx(d.x))
          .attr("y1", (d, i) =>  this.state.height - sy(minY/2)+5)
          .attr("x2", (d, i) =>  sx(d.x))
          .attr("y2", (d, i) => this.state.height - sy(d.y)+5)
          .attr("fill", "none")
          .attr("stroke", (d, i) => "#33aade")
          .attr("stroke-width", (d, i) => 2 )
        ;


      this.state.canvas.selectAll(".histverline_merge_topline"+idx)
        .data([bins[idx]])
        .enter()
        .append("line")
        .attr("class", (d, i) => {
          //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
          return "histverline_merge_topline"+idx;
        })
        .attr("x1", (d, i) => sx(d.x+d.dx/80.0))
        .attr("y1", (d, i) => this.state.height - sy(minY/2.0)+5)
        .attr("x2", (d, i) => sx(d.x-d.dx/20-d.dx/80.0))
        .attr("y2", (d, i) => this.state.height - sy(minY/2.0)+5)
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
          return "#33aade";
        })
        .attr("stroke-width", (d, i) => {
          //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")

          return "2";
          //return i == (b1b2_idx+1) ? "purple" : "#33aade";
        })
      ;

      return histverlineG1;
    }

  drawMergeRightLine(bins, idx, sx, sy){
    let minY = bins[idx].y;

    if (bins[idx+1].y<minY )
      minY = bins[idx+1].y;

    var histverlineG2 = this.state.canvas.selectAll(".histverlineright"+idx)
        .data([bins[idx]])
        .enter()
        .append("line")
        .attr("class", (d, i) => "histverlineright"+idx)
        .attr("x1", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y1", (d, i) => this.state.height - sy(minY/2)+5)
        .attr("x2", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y2", (d, i) => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", (d, i) => "#33aade")
        .attr("stroke-width", (d, i) => "2")
      ;
    return histverlineG2;
  }



    drawCrack(bins, idx,sx,sy) {
      let arr = [bins[idx]];

      // this.state.canvas.selectAll(".histhorline_crack_top_hl"+idx)
      //   .data(arr)
      //   .enter()
      //   .append("line")
      //   .attr("class", (d,i)=>{return "histhorline_crack_top_hl"+idx})
      //   .attr("x1", d => sx(d.x+d.dx/2-d.dx/20.0))
      //   .attr("y1", d => this.state.height - sy(d.y)+5)
      //   .attr("x2", d => {
      //     return sx(d.x+d.dx/2+d.dx/20.0)
      //   })
      //   .attr("y2", d => this.state.height - sy(d.y)+5)
      //   .attr("fill", "none")
      //   //.attr("stroke", "#ffffff")
      //   .attr("stroke", "red")
      //   .attr("stroke-width", "2");

      this.state.canvas.selectAll(".histhorline_crack_left_line"+idx)
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_left_line"+idx})
        .attr("x1", d => sx(d.x+d.dx/2.0-d.dx/20.0))
        .attr("y1", d => this.state.height - sy(d.y)+5)
        .attr("x2", d => {
          return sx(d.x+d.dx/2.0)
        })
        .attr("y2", d => this.state.height - sy(d.y)+5+sy(d.y)/10.0)
        .attr("fill", "none")
        .attr("stroke", "#33aade")
        .attr("stroke-width", "2");

      this.state.canvas.selectAll(".histhorline_crack_right_line"+idx)
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_right_line"+idx})
        .attr("x1", d => sx(d.x+d.dx/2.0))
        .attr("y1", d => this.state.height - sy(d.y)+5+sy(d.y)/10.0)
        .attr("x2", d => {
          return sx(d.x+d.dx/2.0+d.dx/20.0)
        })
        .attr("y2", d => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", "#33aade")
        .attr("stroke-width", "2");
    }




  drawClassicHistBins(hist ) {
    this.state.classicHistCanvas.selectAll("*").remove();
    this.state.classicHistCanvas.append("text")
      .attr("x", d => this.state.width / 2 - 20)
      .attr("y", d => this.state.height + this.state.padding * 0.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .text("classic-histogram");


    var sx = d3.scale.linear()
      .domain([0, d3.max(this.streamedDataContext.histogramData)])
      .range([0, this.state.width * 0.9]);
    var sy = d3.scale.linear()
      .domain([0, d3.max(this.streamedDataContext.bins.map(d => d.size))])
      .range([0, this.state.height * 0.75]);
    //this.getBins(5,this.this.ages);


    let gXaxis = d3.svg.axis().scale(sx).orient("bottom");
    this.state.classicHistCanvas.append("g").style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
      .call(gXaxis)
      .attr("transform", "translate(-5," + (this.state.height + 5) + ")");
    //between bins : ["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]. zeroth index stores the change between bins


    //CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
    //CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
    for (let idx = 0; idx < this.streamedDataContext.bins.length; idx++) {
      this.drawVerLeftLine(this.state.classicHistCanvas, this.streamedDataContext.bins, idx, sx, sy);
      this.drawVerRightLine(this.state.classicHistCanvas, this.streamedDataContext.bins, idx, sx, sy);
      this.drawBarHorizontalLine(this.state.classicHistCanvas, this.streamedDataContext.bins, idx, sx, sy);
      //this.drawBarHorRightLine(bins, idx, sx, sy);
    }
  }




  initData(){
        this.refs={txtBinsCount:null, txtInterval:null, txtBinCountGuess:null};
        this.state = null;
        this.state = {
            stopStart:false, //false:stop, true:start
            visible:false,
            streamingDataIdx: 0,
            interval: 3000,
            binsCount:10,
            ages:[],
            width:400,
            height:400,
            padding:80,
            canvas:null,
            classicHistCanvas: null,
            timer:null,
            mountClass:"ProgHistClassic"
        };
        //this.state.ages = [1, 5, 10, 12, 35, 75, 68, 2, 7, 10, 55, 40, 42, 86, 39, 16, 47, 61, 9, 14, 1, 5, 10, 10, 12, 35, 75, 64, 22, 28, 2, 7, 21, 59, 43, 42, 83, 39, 18, 47, 59, 8, 15];
        this.state.ages=[0,0,0,.99,.99,.99];
        this.setState(this.state);


    }
    componentWillMount() {
      this.histType = this.props.type;
      //this.phStream= new PHStream();
        this.initData();
      // this.start();


    }
}


