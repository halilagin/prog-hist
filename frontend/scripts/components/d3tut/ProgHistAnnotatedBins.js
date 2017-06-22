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

  streamingDataIdx=-1;

  streamedDataContext=null;
  userData = {clicks:[], binCountGuess:0, cost:0, startTime:-1};

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

    render() {


        return (
          <div>
            <div>
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
                  <div className="ph_buttonitem"> <button key="generateData"   onClick={this.generateData.bind(this)} >generateData</button></div>
                  <div className="ph_buttonitem"><button key="refresh"  onClick={this.refresh.bind(this)} >Refresh</button></div>
                </div>
            </div>
            <div className="svgcontainer">

            </div>

            <div id="userevaluation">

            </div>
          </div>
        );
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
    this.generateData();
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
    this.generateData();
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

  generateData(){
    let url = "http://localhost:5000/proghist/streaming/createdata?bincount="+this.refs.txtBinsCount.value;
    axios.get(url)
      .then((resp) => {
        this.setStream(resp.data);
        console.log("data stream created, this.state.binsCount ", this.state.binsCount );
      });

  }

    stopTimer(){
        if (this.state.timer!=null)
            clearInterval(this.state.timer);
        this.state.timer=null;
    }


    componentWillReceiveProps(props) {

    }

    start(){
        this.streamingDataIdx = 42;
        let timeInterval=1000;
        if (this.state!=null && this.state.interval!=null)
            timeInterval = this.state.interval;



        if (this.state.canvas==null)
            this.state.canvas = d3.select(".svgcontainer").append("svg")
                .attr("class", "svg_container")
                .attr("width", this.state.width)
                .attr("height",this.state.height+this.state.padding)
                .append("g")
                .attr("transform", "translate(20,20)")
                ;
        this.state.timer = setInterval(()=>{this.loopDrawingProgHist();}
            ,timeInterval);
    }



  loopDrawingProgHist(){
    this.streamingDataIdx++;
    console.log("this.streamingDataIdx", this.streamingDataIdx);
    let hist = d3.layout.histogram();

    let url = "http://localhost:5000/proghist/streaming/createdata?bincount="+this.refs.txtBinsCount.value+"&idx="+this.streamingDataIdx;
    axios.get(url)
      .then((resp) => {
        this.setStream(resp.data);
        console.log("data stream created, this.state.binsCount ", this.state.binsCount );
        this.drawBins(hist);
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
      if (idx==0) {
        this.drawVerLeftLine(bins, idx, sx, sy);
        this.drawBarHorLeftLine(bins, idx, sx, sy);
      } else if (idx==changesInNewStreamedData.length) {
        if ( changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
          this.drawRightBezierLine(bins, idx, sx,sy);
          //this.drawBarHorLeftLine(bins, idx, sx, sy);
        } else if ( changesInNewStreamedData[idx-1][0]=="MERGING"){
          this.drawMergeLeftLine(bins, idx, sx,sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy);
        } else {
          this.drawVerLeftLine(bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy);
        }

      } else {
        if ( changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
          this.drawRightBezierLine(bins, idx, sx,sy);
          // if ( changesInNewStreamedData[idx][0]!="BECOMING_FAR")
          //   this.drawBarHorRightLine(bins, idx, sx, sy);
        } else if (changesInNewStreamedData[idx-1][0]=="MERGING"){
          this.drawMergeLeftLine(bins, idx, sx,sy);
          // if ( changesInNewStreamedData[idx][0]!="BECOMING_FAR")
          //   this.drawBarHorRightLine(bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy);
        } else {
          this.drawVerLeftLine(bins, idx, sx, sy);
          // if ( changesInNewStreamedData[idx][0]!="BECOMING_FAR")
          //   this.drawBarHorRightLine(bins, idx, sx, sy);
          this.drawBarHorLeftLine(bins, idx, sx, sy);
        }
      }

      //draw right line
      if (idx==changesInNewStreamedData.length) {
        this.drawVerRightLine(bins, idx, sx, sy);
        this.drawBarHorRightLine(bins, idx, sx, sy);
      } else if (idx==0) {
        if ( changesInNewStreamedData[idx][0]=="BECOMING_FAR"){
          this.drawLeftBezierLine(bins, idx, sx,sy);
        } else if ( changesInNewStreamedData[idx][0]=="MERGING"){
          this.drawMergeRightLine(bins, idx, sx,sy);
          this.drawBarHorRightLine(bins, idx, sx, sy);
        } else {
          this.drawVerRightLine(bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy);
        }


      } else {
        if ( changesInNewStreamedData[idx][0]=="BECOMING_FAR"){
          this.drawLeftBezierLine(bins, idx, sx,sy);
          // if ( changesInNewStreamedData[idx-1][0]!="BECOMING_FAR")
          //   this.drawBarHorLeftLine(bins, idx, sx, sy);
        } else if (changesInNewStreamedData[idx][0]=="MERGING"){
          this.drawMergeRightLine(bins, idx, sx,sy);
          this.drawBarHorRightLine(bins, idx, sx, sy);
        } else {
          this.drawVerRightLine(bins, idx, sx, sy);
          this.drawBarHorRightLine(bins, idx, sx, sy);
        }
      }

      //this.drawBarHorLeftLine(bins, idx, sx, sy);
      //this.drawBarHorRightLine(bins, idx, sx, sy);



      if (idx<changesInNewStreamedData.length && changesInNewStreamedData[idx][1] == "SPLITTING") {
          this.drawCrack(bins, idx, sx, sy);
      } else { //SUPPORTS_CONCEPT

      }

      if (idx<changesInNewStreamedData.length && changesInNewStreamedData[idx][2] == "SPLITTING") {
        this.drawCrack(bins, idx+1, sx, sy);
      } else { //SUPPORTS_CONCEPT

      }


      // //inside the second bin: CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
      // if (changesInNewStreamedData[idx][2] == "SPLITTING") {
      //   let arr = [bins[idx+1]];
      //   this.drawCrack(arr, sx, sy);
      //
      // } else { //SUPPORTS_CONCEPT
      //
      // }



    // for (let idx=0;idx<bins.length;idx++) {
    //
    //
    //
    //   if (idx<(changesInNewStreamedData.length) && changesInNewStreamedData[idx][0] == "SUPPORTS_INCREASE") {
    //     if (idx==0) {
    //       this.drawVerLeftLine(bins, idx, sx, sy);
    //       this.drawVerRightLine(bins, idx, sx, sy);
    //       this.drawBarHorLeftLine(bins, idx, sx, sy);
    //       this.drawBarHorRightLine(bins, idx, sx, sy);
    //     } else {
    //       if ((idx-1)>-1 && changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
    //         this.drawRightBezierLine(bins, idx-1, sx,sy);
    //         this.drawVerRightLine(bins, idx-1, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx-1, sx, sy);
    //         this.drawBarHorRightLine(bins, idx-1, sx, sy);
    //       } else {
    //         this.drawVerLeftLine(bins, idx, sx, sy);
    //         this.drawVerRightLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //       }
    //     }
    //   } else if (idx<(changesInNewStreamedData.length) && changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
    //     if (idx==0) {
    //       this.drawVerLeftLine(bins, idx, sx, sy);
    //       this.drawLeftBezierLine(bins, idx, sx,sy);
    //       this.drawBarHorLeftLine(bins, idx, sx, sy);
    //       this.drawBarHorRightLine(bins, idx, sx, sy);
    //     } else {
    //       if ((idx-1)>-1 && changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
    //         this.drawRightBezierLine(bins, idx, sx,sy);
    //         this.drawLeftBezierLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //       } if ((idx-1)>-1 && changesInNewStreamedData[idx-1][0]=="MERGING"){
    //         //alert(1);
    //         //this.drawVerLeftLine(bins, idx, sx,sy);
    //         this.drawLeftBezierLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //         let arr = [bins[idx-1]];
    //         if (idx<bins.length)
    //           arr.push(bins[idx]);
    //         this.drawMergeLines(arr, sx, sy);
    //       } else {
    //         this.drawVerLeftLine(bins, idx, sx, sy);
    //         this.drawLeftBezierLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //       }
    //     }
    //   } else if (idx<(changesInNewStreamedData.length) && changesInNewStreamedData[idx][0] == "MERGING") {
    //     if (idx==0) {
    //       this.drawVerLeftLine(bins, idx, sx, sy);
    //       this.drawLeftBezierLine(bins, idx, sx, sy);
    //       this.drawBarHorLeftLine(bins, idx, sx, sy);
    //       this.drawBarHorRightLine(bins, idx, sx, sy);
    //     } else {
    //       if ((idx-1)>-1 && changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
    //         this.drawRightBezierLine(bins, idx, sx,sy);
    //         this.drawVerRightLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //       } else {
    //         this.drawVerLeftLine(bins, idx, sx, sy);
    //         this.drawVerRightLine(bins, idx, sx, sy);
    //         this.drawBarHorLeftLine(bins, idx, sx, sy);
    //         this.drawBarHorRightLine(bins, idx, sx, sy);
    //       }
    //     }
    //     let arr = [bins[idx]];
    //     if ((idx+1)<bins.length)
    //       arr.push(bins[idx+1]);
    //     this.drawMergeLines(arr, sx, sy);
    //   }
    //   else if (idx==changesInNewStreamedData.length && changesInNewStreamedData[idx-1][0] == "BECOMING_FAR"){
    //     if ((idx-1)>-1 && changesInNewStreamedData[idx-1][0]=="BECOMING_FAR"){
    //       this.drawRightBezierLine(bins, idx, sx,sy);
    //       this.drawVerRightLine(bins, idx, sx, sy);
    //       this.drawBarHorLeftLine(bins, idx, sx, sy);
    //       this.drawBarHorRightLine(bins, idx, sx, sy);
    //     } else {
    //       this.drawVerLeftLine(bins, idx, sx, sy);
    //       this.drawLeftBezierLine(bins, idx, sx, sy);
    //       this.drawBarHorLeftLine(bins, idx, sx, sy);
    //       this.drawBarHorRightLine(bins, idx, sx, sy);
    //     }
    //
    //   }



      //   if (changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
      //   if (idx==0) {
      //     this.drawVerLeftLine(bins, idx, sx, sy);
      //     this.drawVerRightLine(bins, idx, sx, sy);
      //     this.drawBarHorLeftLine(bins, idx, sx, sy);
      //     this.drawBarHorRightLine(bins, idx, sx, sy);
      //   } else {
      //     this.drawLeftBezierLine(idx, sx,sy, bins);
      //     this.drawRightBezierLine(idx+1, sx,sy, bins);
      //     this.drawBarHorLeftLine(bins, 0, sx, sy);
      //     this.drawBarHorRightLine(bins, idx, sx, sy);
      //   }
      // } else {
      //   this.drawVerLeftLine(bins, idx, sx, sy);
      //   this.drawVerRightLine(bins, idx, sx, sy);
      //   this.drawBarHorLeftLine(bins, idx, sx, sy);
      //   this.drawBarHorRightLine(bins, idx, sx, sy);
      //
      // }


      // if ( changesInNewStreamedData[idx][0] == "MERGING" ) {
      //   //this.drawVerLeftLine(bins, idx, sx, sy);
      //   this.drawVerRightLine(bins, idx, sx, sy);
      //   let arr = [bins[idx]];
      //   if ((idx+1)<bins.length)
      //     arr.push(bins[idx+1]);
      //   this.drawMergeLines(arr, sx, sy);
      // } else if (changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
      //   let curve_idx=idx;
      //   //this.drawVerLeftLine(bins, idx, sx, sy);
      //   if (idx==0)
      //     this.drawVerLeftLine(bins, idx, sx, sy);
      //   else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1)*3 ] == "BECOMING_FAR")
      //     ;
      //   // else
      //   //   this.drawVerLeftLine(bins, idx, sx, sy);
      //   this.drawRightBezierLine(curve_idx, sx,sy, bins);
      //   this.drawLeftBezierLine(curve_idx+1, sx,sy, bins);
      // } else {//supports concept "SUPPORT_CONTEXPT"
      //   if (idx==0)
      //     this.drawVerLeftLine(bins, idx, sx, sy);
      //   else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1) ][0] == "BECOMING_FAR")
      //     ;
      //   else
      //     this.drawVerLeftLine(bins, idx, sx, sy);
      //   this.drawVerRightLine(bins, idx, sx, sy);
      // }
      //
      // //draw horizontal left half and right half line
      // if (idx==0)
      //   this.drawBarHorLeftLine(bins, idx, sx, sy);
      // if (changesInNewStreamedData[idx][0] == "BECOMING_FAR") {
      //   if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1) ][0] == "BECOMING_FAR")
      //       ;
      //   else
      //     this.drawBarHorLeftLine(bins, idx, sx, sy);
      // } else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1) ][0] == "BECOMING_FAR") {
      //   this.drawBarHorRightLine(bins, idx, sx, sy);
      // } else {
      //   this.drawBarHorizontalLine(bins, idx, sx, sy);
      // }
      //
      // //inside the first bin: CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
      // if (changesInNewStreamedData[idx][1] == "SPLITTING") {
      //   let sinIdx = idx;
      //   let arr = [bins[sinIdx]];
      //   this.drawCrack(arr, sx, sy);
      // } else { //SUPPORTS_CONCEPT
      //
      // }
      //
      // //inside the second bin: CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
      // if (changesInNewStreamedData[idx][2] == "SPLITTING") {
      //   let sinIdx = idx + 1;
      //   let arr = [bins[sinIdx]];
      //   this.drawCrack(arr, sx, sy);
      //
      // } else { //SUPPORTS_CONCEPT
      //
      // }

    }

  }




  drawBarHorizontalLine(bins, idx, sx,sy) {
    this.state.canvas.selectAll(".histhorline"+idx)
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

  drawBarHorLeftLine(bins, idx, sx,sy) {
    this.state.canvas.selectAll(".histhorlineleft"+idx)
      .data([bins[idx]])
      .enter()
      .append("line")
      .classed("histhorlineleft"+idx, true)
      .attr("x1", d => sx(d.x))
      .attr("y1", d => this.state.height - sy(d.y) + 5)
      .attr("x2", d => {
        return sx( d.x + d.dx/2.0 - d.dx/20)
      })
      .attr("y2", d => this.state.height - sy(d.y) + 5)
      .attr("fill", "none")
      .attr("stroke", "#33aade")
      .attr("stroke-width", "2");
  }

  drawBarHorRightLine(bins, idx, sx,sy) {
    this.state.canvas.selectAll(".histhorlineright"+idx)
      .data([bins[idx]])
      .enter()
      .append("line")
      .classed("histhorlineright"+idx, true)
      .attr("x1", d => sx(d.x+d.dx/2))
      .attr("y1", d => this.state.height - sy(d.y) + 5)
      .attr("x2", d => {
        return sx( d.x + d.dx - d.dx / 20.0)
      })
      .attr("y2", d => this.state.height - sy(d.y) + 5)
      .attr("fill", "none")
      .attr("stroke", "#33aade")
      .attr("stroke-width", "2");
  }








  drawVerRightLine(bins, idx, sx, sy){
    var histverlineG2 = this.state.canvas.selectAll(".histverlineright"+idx)
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






  drawRightBezierLine(bins, idx, sx,sy){
    let curvedata = [
      [sx(bins[idx].x), this.state.height+5],
      [sx(bins[idx].x)+bins[idx].dx/3.0,this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx/2.5), this.state.height - sy(bins[idx].y)+5],
      [sx(bins[idx].x+bins[idx].dx/2.0)+5, this.state.height - sy(bins[idx].y)+5]
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


  drawLeftBezierLine(bins, idx, sx,sy){
    let curvedata = [
      [sx(bins[idx].x+bins[idx].dx) - 5, this.state.height+5],
      [sx(bins[idx].x+bins[idx].dx - bins[idx].dx/20.0)-5, this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx - bins[idx].dx/6.0)-5, this.state.height - sy(bins[idx].y)+5],
      [sx(bins[idx].x+bins[idx].dx/2.0)-5, this.state.height - sy(bins[idx].y)+5]
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

    drawBoxplots(bars, sx,sy,height, color){
         bars.append("line")
            .attr("class","boxplot")
            .attr("x1", (d,i)=>sx(d.x+d.dx/2))
            .attr("y1", (d,i)=>height-sy(d.y)-5)
            .attr("x2", (d,i)=>sx(d.x+d.dx/2))
            .attr("y2", (d,i)=>height-sy(d.y)+5)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", "1")
            ;

        bars.append("line")
            .attr("class","boxplottop")
            .attr("x1", (d,i)=>sx(d.x+d.dx/2)-2)
            .attr("y1", (d,i)=>height-sy(d.y)-5)
            .attr("x2", (d,i)=>sx(d.x+d.dx/2)+2)
            .attr("y2", (d,i)=>height-sy(d.y)-5)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", "1")
        ;

        bars.append("line")
            .attr("class","boxplotbottom")
            .attr("x1", (d,i)=>sx(d.x+d.dx/2)-2)
            .attr("y1", (d,i)=>height-sy(d.y)+5)
            .attr("x2", (d,i)=>sx(d.x+d.dx/2)+2)
            .attr("y2", (d,i)=>height-sy(d.y)+5)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", "1")
        ;


    }

    drawPie(canvas, x,y,r,w, dir, color){
        let p = Math.PI *2;
        let group = canvas.append("g").attr("transform", "translate("+x+","+y+")");
        let startAngle_ = dir==="up"?p*0.75:p*0.25;
        let endAngle_ = dir==="up"?p*1.25:p*0.75;
        let arc = d3.svg.arc()
            .innerRadius(r-w)
            .outerRadius(r)
            .startAngle(startAngle_)
            .endAngle(endAngle_);
        group.append("path").attr("d", arc)
            .attr("fill", color);
    }



  drawVerLeftLine(bins, idx, sx, sy){
    var histverlineG1 = this.state.canvas.selectAll(".histverlineleft"+idx)
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
      return histverlineG1;



      // let right = [bin_[idx]];
      // this.state.canvas.selectAll(".histverline_merge_right")
      //   .data(right)
      //   .enter()
      //   .append("line")
      //   .attr("class", (d, i) => {
      //     //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
      //     return "histverline_merge_right";
      //   })
      //   .attr("x1", (d, i) =>  sx(d.x))
      //   .attr("y1", (d, i) => this.state.height+5)
      //   .attr("x2", (d, i) => sx(d.x))
      //   .attr("y2", (d, i) => this.state.height - sy(minY/2.0)+5)
      //   .attr("fill", "none")
      //   .attr("stroke", (d, i) => {
      //     //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
      //     return "red";
      //   })
      //   .attr("stroke-width", (d, i) => {
      //     //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
      //
      //     return "2";
      //     //return i == (b1b2_idx+1) ? "purple" : "#33aade";
      //   })
      // ;
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
    // let left = [bin_[idx]];
    // this.state.canvas.selectAll(".histverline_merge_left")
    //   .data(left)
    //   .enter()
    //   .append("line")
    //   .attr("class", (d, i) => {
    //     //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //     return "histverline_merge_left";
    //   })
    //   .attr("x1", (d, i) => sx(d.x+d.dx-d.dx/20.0))
    //   .attr("y1", (d, i) => this.state.height+5)
    //   .attr("x2", (d, i) => sx(d.x+d.dx-d.dx/20.0))
    //   .attr("y2", (d, i) => this.state.height - sy(minY/2)+5)
    //   .attr("fill", "none")
    //   .attr("stroke", (d, i) => {
    //     //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //     return "#ffffff";
    //   })
    //   .attr("stroke-width", (d, i) => {
    //     //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //
    //     return "2";
    //     //return i == (idx+1) ? "purple" : "#33aade";
    //   })
    // ;

  }

    drawMergeLines (arr,sx,sy) {

      let minY = arr[0].y;

      if (arr.length==2 && arr[1].y<minY )
          minY = arr[1].y;



      let left = [arr[0]];
      this.state.canvas.selectAll(".histverline_merge_left")
        .data(left)
          .enter()
          .append("line")
          .attr("class", (d, i) => {
            //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
            return "histverline_merge_left";
          })
        .attr("x1", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y1", (d, i) => this.state.height+5)
        .attr("x2", (d, i) => sx(d.x+d.dx-d.dx/20.0))
        .attr("y2", (d, i) => this.state.height - sy(minY/2)+5)
          .attr("fill", "none")
          .attr("stroke", (d, i) => {
            //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
            return "#ffffff";
          })
          .attr("stroke-width", (d, i) => {
            //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")

            return "2";
            //return i == (idx+1) ? "purple" : "#33aade";
          })
        ;



      if (arr.length==2){

        let right = [arr[1]];
        this.state.canvas.selectAll(".histverline_merge_right")
          .data(right)
          .enter()
          .append("line")
          .attr("class", (d, i) => {
            //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
            return "histverline_merge_right";
          })
          .attr("x1", (d, i) =>  sx(d.x))
          .attr("y1", (d, i) => this.state.height+5)
          .attr("x2", (d, i) => sx(d.x))
          .attr("y2", (d, i) => this.state.height - sy(minY/2.0)+5)
          .attr("fill", "none")
          .attr("stroke", (d, i) => {
            //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
            return "red";
          })
          .attr("stroke-width", (d, i) => {
            //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")

            return "2";
            //return i == (b1b2_idx+1) ? "purple" : "#33aade";
          })
        ;



        this.state.canvas.selectAll(".histverline_merge_topline")
          .data(right)
          .enter()
          .append("line")
          .attr("class", (d, i) => {
            //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
            return "histverline_merge_topline";
          })
          .attr("x1", (d, i) => sx(d.x))
          .attr("y1", (d, i) => this.state.height - sy(minY/2.0)+5)
          .attr("x2", (d, i) => sx(d.x-d.dx/20))
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

      }

    }

    drawCrack(bins, idx,sx,sy) {
      let arr = [bins[idx]];

      this.state.canvas.selectAll(".histhorline_crack_top_hl"+idx)
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_top_hl"+idx})
        .attr("x1", d => sx(d.x+d.dx/2-d.dx/20.0))
        .attr("y1", d => this.state.height - sy(d.y)+5)
        .attr("x2", d => {
          return sx(d.x+d.dx/2+d.dx/20.0)
        })
        .attr("y2", d => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "2");

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

    drawSinus(canvas, x,y,r,w, color){
        this.drawPie(canvas, x,y, r/2,w, "up",color);
        this.drawPie(canvas, x+r,y, r/2,w, "down", color);

    }



  drawClassicHistBins(hist ) {
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
    this.state.canvas.append("g").style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
      .call(gXaxis)
      .attr("transform", "translate(-5," + (this.state.height + 5) + ")");
    //between bins : ["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]. zeroth index stores the change between bins


    //CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
    //CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
    for (let idx = 0; idx < this.streamedDataContext.bins.length; idx++) {
      let changesInNewStreamedData = this.streamedDataContext.binchanges;
      let bins = this.streamedDataContext.bins;
      //console.log("changesInNewStreamedData["+idx+"]",changesInNewStreamedData[idx]);
      this.drawVerLeftLine(bins, idx, sx, sy);
      this.drawVerRightLine(bins, idx, sx, sy);
      this.drawBarHorLeftLine(bins, idx, sx, sy);
      this.drawBarHorRightLine(bins, idx, sx, sy);
    }
  }




  initData(){
        this.refs={txtBinsCount:null, txtInterval:null, txtBinCountGuess:null};
        this.state = null;
        this.state = {
            interval: 3000,
            binsCount:5,
            ages:[],
            width:400,
            height:400,
            padding:80,
            canvas:null,
            timer:null,
            mountClass:"ProgHistClassic"
        };
        //this.state.ages = [1, 5, 10, 12, 35, 75, 68, 2, 7, 10, 55, 40, 42, 86, 39, 16, 47, 61, 9, 14, 1, 5, 10, 10, 12, 35, 75, 64, 22, 28, 2, 7, 21, 59, 43, 42, 83, 39, 18, 47, 59, 8, 15];
        this.state.ages=[0,0,0,.99,.99,.99];
        this.setState(this.state);


    }
    componentWillMount() {
      //this.phStream= new PHStream();
        this.initData();
      // this.start();


    }
}


