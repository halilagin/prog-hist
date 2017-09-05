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


export class ParallelCoord extends Component {

  m = [80, 80, 80, 80]; // margins
  w = 1000 - this.m[1] - this.m[3]; // width
  h = 400 - this.m[0] - this.m[2]; // height

  render() {


        return (
          <div>
            {/*<div className="svgcontainer">*/}

            {/*</div>*/}

          </div>
        );
    }



  generateData(){
    let url = "http://localhost:5000/proghist/streaming/createdata?bincount="+this.refs.txtBinsCount.value;
    //axios.get("http://localhost:5000/proghist/streaming/data/0")

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
    componentWillReceiveProps(props) {

    }

    setStreamedData(data){
      this.state.data = data;
      this.setState(this.state);
    }





    start(){
        this.streamingDataIdx = -1;
        let timeInterval=1000000;
        if (this.state!=null && this.state.interval!=null)
            timeInterval = this.state.interval;

        if (this.state.canvas==null)
            this.state.canvas = d3.select(".svgcontainer").append("svg")
                .attr("class", "svg_container")
                .attr("width", this.w + this.m[1] + this.m[3])
                .attr("height", this.h + this.m[0] + this.m[2])
                .append("g")
              .attr("transform", "translate(" + this.m[3] + "," + this.m[0] + ")");
        // this.state.timer = setInterval(()=>{this.loopDrawingProgHist();}
        //     ,timeInterval);

      this.loopDrawingProgHist();
    }


    drawParallelCoord(){
      var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 25, 7];
      let sx = d3.scale.linear().domain([0, data.length]).range([0,this.w]);
      let sy = d3.scale.linear().domain([0, d3.max(data)*1.50]).range([ this.h, 0]);

      var line = d3.svg.line()
        .x(function(d,i) {
          return sx(i);
        })
        .y(function(d) {
          return sy(d);
        });
      var line2 = d3.svg.line()
        .x(function(d,i) {
          return sx(i);
        })
        .y(function(d) {
          return sy(d+3);
        });

      // Add an SVG element with the desired dimensions and margin.
      var graph = d3.select("#graph").append("svg:svg")
        .attr("width", this.w + this.m[1] + this.m[3])
        .attr("height", this.h + this.m[0] + this.m[2])
        .append("svg:g")
        .attr("transform", "translate(" + this.m[3] + "," + this.m[0] + ")");
      var xAxis = d3.svg.axis().scale(sx).ticks(data.length).tickSize(-this.h).tickSubdivide(true).tickPadding(5);
      graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.h + ")")
        .call(xAxis);


      var yAxisLeft = d3.svg.axis().scale(sy).ticks(d3.max(data)/2).orient("left");
      graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

      graph.append("svg:path").attr("d", line(data));
      graph.append("svg:path").attr("d", line2(data));


    }


    loopDrawingProgHist(){
      console.log("streamingDataIdx", this.state.streamingDataIdx);

      let url = "http://localhost:5000/proghist/parallelcoord/streaming/fetchdata";
      axios.get(url)
        .then((resp) => {

          this.setStreamedData(resp.data.data);
          this.drawParallelCoord();
          //this.state.streamingDataIdx = this.state.streamingDataIdx +1;
          this.setState(this.state);
        });
    }



    initData(){
        this.refs={txtBinsCount:null, txtInterval:null, txtBinCountGuess:null};
        this.state = null;
        this.state = {
            interval: 1000000,
            data:[],
            canvas:null,
            timer:null,
            mountClass:"ProgHistClassic"
        };
        this.setState(this.state);


    }
    componentWillMount() {
         this.initData();
         this.start();
    }
}


