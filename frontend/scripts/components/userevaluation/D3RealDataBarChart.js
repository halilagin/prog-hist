import React, {Component} from 'react';
import NVD3Chart from 'react-nvd3'
import * as axios from 'axios';
import * as d3 from 'd3';

export class D3RealDataBarChart extends Component {



  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  componentWillMount() {
    console.log("componentWillMount.start");
    let url = "http://localhost:5000/proghist/streaming/proghistrealdata";
    axios.get(url)
      .then((resp) => {
        this.setState({'data': resp.data});


      });

  }


  render() {

    if (this.state.data) {
      console.log("realdatachart.data", this.state.data);
      let data = this.state.data;
      var formatCount = d3.format(",.0f");

      var svg = d3.select("#RealDataBarChart"),
        margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear()
        .rangeRound([0, width]);

      var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);

      var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

      var bar = g.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

      bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

      bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      return (
        <div>

        </div>
      );
    }
    else {
      return (<div>Loading...</div>)
    }
  }
}
