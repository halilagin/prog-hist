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
  sx=null;
    sy=null;

    render() {


        return (
          <div>
            <div className="svgcontainer">

            </div>
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
                .attr("width", this.state.width)
                .attr("height",this.state.height+this.state.padding)
                .append("g")
                .attr("transform", "translate(20,20)")
                ;
        // this.state.timer = setInterval(()=>{this.loopDrawingProgHist();}
        //     ,timeInterval);

      this.loopDrawingProgHist();
    }

    drawLeftMostY(){
      let yAxis = d3.svg.axis().scale(this.sy).orient("left");
      this.state.canvas.append("g").style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
        .call(yAxis);

    }

    drawParallelCoord(){
      console.log("data",this.state.data);
      this.sx = d3.scale.linear()
        .domain([0, d3.max(this.state.data[0])])
        .range([0, this.state.width * 0.9]);
      this.sy = d3.scale.linear()
        .domain([0, d3.max(this.state.data[0])])
        .range([0, this.state.height * 0.75]);
      this.drawLeftMostY();
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
            width:400,
            height:400,
            padding:80,
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


