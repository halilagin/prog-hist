import React, {Component} from 'react';
import * as d3 from 'd3';
import * as axios from 'axios';


class TwoBinsProgHistData extends Component {
  binSizes=null;
  origData=null;
  catData=null;
  freqs=null;

  //changes array has 3 elements. first indicates changes between 2 bins,
  // second indicates change in forst bin and the last shows changes in second bin.
  // example
  // "BECOMING_FAR" : two bins become for away from eachother
  // 1: "SPLITTING" : first bins splits
  // 2: "SUPPORTS_CONCEPT" : second bin support the concept. namely, preserve the ration between its accompanying bin.

  changes=null;
}






export class ProgHistClassicStreaming extends Component {
  CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
  CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]

  streamingDataIdx=-1;
  twobinsArray=[];
  userData = {clicks:[],binCountGuess:0,cost:0, startTime:-1};

  // changes array has 3 elements. first indicates changes between 2 bins,
  // second indicates change in first bin and the last shows changes in second bin.
  // example
  // "BECOMING_FAR" : two bins become for away from each other.
  // 1: "SPLITTING" : first bins splits
  // 2: "SUPPORTS_CONCEPT" : second bin support the concept. namely, preserve the ration between its accompanying bin.

  setStream(data){
    // this.raw = data;
    // this.binSizes = data[0];
    // this.origData = data[1];
    // this.catData = data[2];
    // this.freqs = data[3];
    // this.changes = data[4];
    this.twobinsArray=[];
    for (let i=0;i<(data.length);i++){
      let tb = new TwoBinsProgHistData()
      tb.binSizes = data[i][0];

      tb.origData = data[i][1];
      tb.catData = data[i][2];
      tb.freqs = data[i][3];
      tb.changes = data[i][4];
      this.twobinsArray.push(tb)
    }

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
    console.log(this.userData);
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
    //axios.get("http://localhost:5000/proghist/streaming/data/0")
    console.log("url", url);
    axios.get(url)
      .then((resp) => {
        this.setStream(resp.data);
        console.log(this.twobinsArray);
        //+1 [ab,bc,cd,de] -> [a,b,c,d,e], 4lu ikili iliski 5li bin in iliskisidir. 5 i bulmak icin +1 eklendi
        //this.setState({binsCount:this.twobinsArray.length+1 });
        //this.state.binsCount = this.twobinsArray.length+1;
        //this.setState(this.state);
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


    sortArr(arr_){
        for (var i=0;i<arr_.length;i++){
            for(var j=0;j<arr_.length-1;j++){
                if (arr_[j]>arr_[j+1]) {
                    let temp = arr_[j];
                    arr_[j]=arr_[j+1];
                    arr_[j+1]=temp;
                }
            }
        }
    }

    getBins(binNumber, arr_){
        let bins = [];

        this.sortArr(arr_);

        let minValue = arr_[0];
        let maxValue = arr_[arr_.length-1];
        let barRange = (maxValue-minValue)/binNumber;
        for (var i=0;i<binNumber;i++){
            let range  = [i*barRange, (i+1)*barRange];
            let barValues = [];
            for (var j=0;j<arr_.length;j++){
                if (arr_[j]>=range[0] && arr_[j]<=range[1])
                    barValues.push(arr_[j]);
            }
            bins.push(barValues);
        }

        return bins;
        //console.log(bins);

    }

     myrand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    randFn25(){
        return d3.random.normal(25,5);
    }

    randFn50(){
        return d3.random.normal(50,5);
    }

    randFn75(){
        return d3.random.normal(75,5);
    }

    start(){
        this.streamingDataIdx = -1;
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


  drawTwoBins(hist, newStreamedData,changesInNewStreamedData ) {
    let chooseRand = this.myrand(0, 2);
    let pieIdx = this.myrand(0, this.state.binsCount);

    this.state.canvas.selectAll("*").remove();
    this.state.canvas.append("text")
      .attr("x", d => this.state.width / 2 - 20)
      .attr("y", d => this.state.height + this.state.padding * 0.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .text("prog-hist-classic");

    let newAges = this.state.ages;
    for (var i = 0; i < newStreamedData.length; i++) {
      newAges.push(newStreamedData[i]);
    }
    this.setState({ages: newAges});
    console.log(this.state.ages);
    let bins = hist.bins(this.state.binsCount)(this.state.ages);
    var sx = d3.scale.linear()
      .domain([0, d3.max(this.state.ages)])
      .range([0, this.state.width * 0.9]);
    var sy = d3.scale.linear()
      .domain([0, d3.max(bins.map(d => d.y))])
      .range([0, this.state.height * 0.75]);
    //this.getBins(5,this.this.ages);

    let histVerLines = [{
      "x1": 1,
      "y1": 0,
      "x2": bins[0].x,
      "y2": bins[0].y
    }];
    // for (var i = 0; i < bins.length - 1; i++) {
    //   histVerLines.push({
    //     "x1": bins[i].x + bins[i].dx,
    //     "y1": bins[i].y,
    //     "x2": bins[i + 1].x,
    //     "y2": bins[i + 1].y
    //   });
    // }





    let gXaxis = d3.svg.axis().scale(sx).orient("bottom");
    this.state.canvas.append("g").style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
      .call(gXaxis)
      .attr("transform", "translate(-5," + (this.state.height + 5) + ")");
    console.log(changesInNewStreamedData);
      //between bins : ["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]. zeroth index stores the change between bins

    // var histverlineG1 = this.state.canvas.selectAll(".histverline")
    //     .data(bins)
    //     .enter()
    //     .append("line")
    //     .attr("class", (d, i) => {
    //       if (changesInNewStreamedData[(i-1)*3]=="SUPPORTS_INCREASE")
    //         return "histverline";
    //       })
    //     .attr("x1", (d, i) => {
    //       if (changesInNewStreamedData[(i-1)*3]=="SUPPORTS_INCREASE")
    //         return sx(d.x);
    //     })
    //     .attr("y1", (d, i) => {
    //       if (changesInNewStreamedData[(i-1)*3]=="SUPPORTS_INCREASE")
    //         return this.state.height+5;
    //     })
    //     .attr("x2", (d, i) => {
    //       if (changesInNewStreamedData[(i-1)*3]=="SUPPORTS_INCREASE")
    //         return sx(d.x);
    //     })
    //     .attr("y2", (d, i) => {
    //       if (changesInNewStreamedData[(i-1)*3]=="SUPPORTS_INCREASE")
    //         return this.state.height - sy(d.y)+5;
    //     })
    //     .attr("fill", "none")
    //     .attr("stroke", (d, i) => {
    //         //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //         return "#33aade";
    //     })
    //     .attr("stroke-width", (d, i) => {
    //       //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //
    //       return "2";
    //       //return i == (b1b2_idx+1) ? "purple" : "#33aade";
    //     })
    //   ;



    // var histverlineG2 = this.state.canvas.selectAll(".histverline2")
    //     .data(bins)
    //     .enter()
    //     .append("line")
    //     .attr("class", (d, i) => {
    //       //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //       return "histverline2";
    //     })
    //     .attr("x1", (d, i) => sx(d.x+d.dx-d.dx/20.0))
    //     .attr("y1", (d, i) => this.state.height+5)
    //     .attr("x2", (d, i) => sx(d.x+d.dx-d.dx/20.0))
    //     .attr("y2", (d, i) => this.state.height - sy(d.y)+5)
    //     .attr("fill", "none")
    //     .attr("stroke", (d, i) => {
    //       //   if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //       return "#33aade";
    //     })
    //     .attr("stroke-width", (d, i) => {
    //       //if (changesInNewStreamedData[(i-1)*3]=="BECOMING_FAR")
    //       return "2";
    //     })
    //   ;


    for (let idx=0,k=0 ;idx<bins.length;idx++, k=idx*3) {

      if ( changesInNewStreamedData[k] == "MERGING" ) {
        console.log("bins,mering",[bins[idx]]);

        this.drawVerLeftLine(bins, idx, sx, sy);
        this.drawVerRightLine(bins, idx, sx, sy);

        let arr = [bins[idx]];
        if ((idx+1)<bins.length)
          arr.push(bins[idx+1]);
        this.drawMergeLines(arr, sx, sy);



      } else if (changesInNewStreamedData[k] == "BECOMING_FAR") {

        let curve_idx=idx;
        //this.drawVerLeftLine(bins, idx, sx, sy);
        if (idx==0)
          this.drawVerLeftLine(bins, idx, sx, sy);
        else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1)*3 ] == "BECOMING_FAR")
          ;
        else
          this.drawVerLeftLine(bins, idx, sx, sy);
        this.drawRightBezierLine(curve_idx, sx,sy, bins);
        this.drawLeftBezierLine(curve_idx+1, sx,sy, bins);
      } else {//supports concept "SUPPORT_CONTEXPT"



        console.log("bins,supportconcepts",[bins[idx]]);
        if (idx==0)
          this.drawVerLeftLine(bins, idx, sx, sy);
        else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1)*3 ] == "BECOMING_FAR")
          ;
        else
          this.drawVerLeftLine(bins, idx, sx, sy);
        this.drawVerRightLine(bins, idx, sx, sy);
      }

      //draw horizontal left half and right half line
      if (idx==0)
        this.drawBarHorLeftLine(bins, idx, sx, sy);

      if (changesInNewStreamedData[ (idx)*3 ] == "BECOMING_FAR") {
        if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1)*3 ] == "BECOMING_FAR")
            ;
        else
          this.drawBarHorLeftLine(bins, idx, sx, sy);
       console.log(idx,"horz.line.1");//current right nand next left will be drawn.
      } else if ( (idx-1) > -1 && changesInNewStreamedData[ (idx-1)*3 ] == "BECOMING_FAR") {
        console.log(idx, "horz.line.2");
        this.drawBarHorRightLine(bins, idx, sx, sy);
      }else {
        console.log(idx,"horz.line.4");
        this.drawBarHorizontalLine(bins, idx, sx, sy);
      }
      //inside the first bin: CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
      if (changesInNewStreamedData[k + 1] == "SPLITTING") {
        console.log ("splitting first bin,",k+1);
        console.log("draw splitting on bin1");
        let sinIdx = idx;
        let arr = [bins[sinIdx]];
        this.drawCrack(arr, sx, sy);
      } else { //SUPPORTS_CONCEPT

      }

      //inside the second bin: CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
      if (changesInNewStreamedData[k + 2] == "SPLITTING") {
        console.log ("splitting second bin,",k+2);
        console.log("draw splitting on bin2");
        let sinIdx = idx + 1;
        let arr = [bins[sinIdx]];
        this.drawCrack(arr, sx, sy);

      } else { //SUPPORTS_CONCEPT

      }

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
        return sx( d.x + d.dx/2.0)
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

  loopDrawingProgHist(){
      this.streamingDataIdx++;
      let hist = d3.layout.histogram();
      let newStreamedData = [];
      let changesInNewStreamedData = [];
      let newOrigStreamedData = [];

    for (let i=0;i<this.twobinsArray.length;i++){
        let phStream = this.twobinsArray[i];
        newStreamedData = newStreamedData.concat(phStream.catData[this.streamingDataIdx]);
        //console.log(newStreamedData);
        changesInNewStreamedData = changesInNewStreamedData.concat(phStream.changes[this.streamingDataIdx]);
        newOrigStreamedData = newOrigStreamedData.concat(phStream.origData[this.streamingDataIdx]);
    }

      this.drawTwoBins(hist, newOrigStreamedData, changesInNewStreamedData);
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






  drawLeftBezierLine(idx, sx,sy,bins){
    let curvedata = [
      [sx(bins[idx].x), this.state.height+5],
      [sx(bins[idx].x)+bins[idx].dx/3.0,this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx/2.5), this.state.height - sy(bins[idx].y)+5],
      [sx(bins[idx].x+bins[idx].dx/2.0), this.state.height - sy(bins[idx].y)+5]
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


  drawRightBezierLine(idx, sx,sy,bins){
    let curvedata = [
      [sx(bins[idx].x+bins[idx].dx)-5, this.state.height+5],
      [sx(bins[idx].x+bins[idx].dx-bins[idx].dx/12.0)-5,this.state.height - sy(bins[idx].y/1.2)+5],
      [sx(bins[idx].x+bins[idx].dx-bins[idx].dx/6.0)-5, this.state.height - sy(bins[idx].y)+5],
      [sx(bins[idx].x+bins[idx].dx-bins[idx].dx/2.0)-5, this.state.height - sy(bins[idx].y)+5]
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


    drawMergeLines (arr,sx,sy) {

      let minY = arr[0].y;

      if (arr.length==2 && arr[1].y<minY )
          minY = arr[1].y;
      console.log("minY,", minY);


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
            return "#ffffff";
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

    drawCrack(arr,sx,sy) {
      this.state.canvas.selectAll(".histhorline_crack_top_hl")
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_top_hl"})
        .attr("x1", d => sx(d.x+d.dx/2-d.dx/20.0))
        .attr("y1", d => this.state.height - sy(d.y)+5)
        .attr("x2", d => {
          return sx(d.x+d.dx/2+d.dx/20.0)
        })
        .attr("y2", d => this.state.height - sy(d.y)+5)
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "2");

      this.state.canvas.selectAll(".histhorline_crack_left_line")
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_left_line"})
        .attr("x1", d => sx(d.x+d.dx/2-d.dx/20.0))
        .attr("y1", d => this.state.height - sy(d.y)+5)
        .attr("x2", d => {
          return sx(d.x+d.dx/2)
        })
        .attr("y2", d => this.state.height - sy(d.y)+5+10)
        .attr("fill", "none")
        .attr("stroke", "#33aade")
        .attr("stroke-width", "2");

      this.state.canvas.selectAll(".histhorline_crack_right_line")
        .data(arr)
        .enter()
        .append("line")
        .attr("class", (d,i)=>{return "histhorline_crack_left_line"})
        .attr("x1", d => sx(d.x+d.dx/2))
        .attr("y1", d => this.state.height - sy(d.y)+5+10)
        .attr("x2", d => {
          return sx(d.x+d.dx/2+d.dx/20.0)
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


