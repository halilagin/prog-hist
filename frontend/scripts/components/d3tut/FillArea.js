import React, {Component} from 'react';
import * as d3 from 'd3';
import * as axios from 'axios';




export class FillArea extends Component {

    origData = {x:null,y:null,sigma:null};
    data = null;
    render() {


        return (
          <div>
            <div className="ExpIntro">
              welcome!
              <div className="fillarea_buttons">
                <span className="btn btn-primary" onClick={this.getData.bind(this)}> Get data</span>
              </div>
              <div className="fillAreaCntr"></div>

            </div>
          </div>
        );
    }


    show(){
      this.state.visible = true;
      this.setState(this.state);
    }

    hide(){
      this.state.visible = false;
      this.setState(this.state);
    }

    toggleDisplay(){
      this.state.visible = !this.state.visible;
      this.setState(this.state);
    }


    getData(){

      let url = "http://localhost:5000/proghist/streaming/gaussianprocess/createdata";

      axios.post(url, this.userData)
        .then( (resp) => {
          this.origData.x = resp.data[0];
          this.origData.y = resp.data[1];
          this.origData.sigma = resp.data[2];
          this.start();
        })
        .catch(function (error) {
          console.log(error);
        });
    }



  initData(){
        this.refs={txtBinsCount:null, txtInterval:null, txtBinCountGuess:null};
        this.state = null;
        this.state = {
          visible:true
        };
        this.setState(this.state);
        //Reveal.initialize();

  }

  produceX(){
    let x = [];
    for (var i=0;i<100;i++){
      x.push(i*0.1);
    }
    return x;
  }

  produceY(){
    let x = [];
    for (var i=0;i<100;i++){
      x.push(i*0.1);
    }
    return x;
  }

  start(){
    this.data = [];
    for (var i=0;i<this.origData.x.length;i++){
        this.data.push (
          {
            x:this.origData.x[i],
            y:this.origData.y[i],
            sigma:this.origData.sigma[i]
          }
        );
    }
    console.log("Data", this.data);
    // this.data = [
    //   { x: 0, y: 10, },
    //   { x: 1, y: 15, },
    //   { x: 2, y: 35, },
    //   { x: 3, y: 20, },
    // ];

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


    var sx = d3.scale.linear()
      .domain([0, d3.max(this.data, function(d) { return d.x; })])
    .range([0, width]);
    var sy = d3.scale.linear()
      .domain([d3.min(this.data, function(d) { return d.y; }), d3.max(this.data, function(d) { return d.y; })])
      .range([height, d3.min(this.data, function(d) { return d.y; })]);

    var xAxis = d3.svg.axis()
      .scale(sx)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(sy)
      .orient("left");

    var area = d3.svg.area()
      .x( function(d) { return sx(d.x); })
      .y0( function(d) { return sy(d.y - d.sigma); } )
      //.y0( height )
      .y1( function(d) { return sy(d.y+d.sigma ); } );



    this.state.canvas = d3.select(".fillAreaCntr").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    this.state.canvas.append("path")
    .datum(this.data)
    .attr("class", "fillarea_area")
    .attr("d", area);

      // this.state.canvas.append("path")
      //   .data(this.data)
      //   .attr("class", "fillarea_line")
      //   .attr("d", valueline);

    this.state.canvas.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    this.state.canvas.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  }

    componentWillMount() {
        this.initData();

        this.getData();

    }
}


