import React, {Component} from 'react';
import * as d3 from 'd3';


export class MyHist extends Component {

    render() {
        return (
            <div>
                <p>this is vid01 a paragraph!</p>
            </div>
        );
    }


    componentWillReceiveProps(props) {
        this.setState({name: props.name});
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

        //console.log(bins);

    }

    sample1(){
        d3.csv("/public/data/ages.csv", (data)=>{

            var width=500, height=500, padding=50;

            let ages = data.map(d=>parseInt(d.Age));
            console.log(ages);
            let hist = d3.layout.histogram();
            let bins = hist.bins(7)(ages);
            //this.getBins(5,ages);
            console.log(bins);


            var sy = d3.scale.linear()
                .domain([0, d3.max(bins.map(d=>d.y))])
                .range([0, height]);
            var sx = d3.scale.linear()
                .domain([0, d3.max(ages)])
                .range([0,width]);

            let canvas = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height",height+padding)
                .append("g")
                .attr("transform", "translate(20,20)")
                ;
            var bars = canvas.selectAll(".bar")
                .data(bins)
                .enter()
                .append("g")
                ;

            let scale = 5;
            bars.append("rect")
                .attr("x", d=>sx(d.x) )
                .attr("y", d=>height-sy(d.y))
                .attr("width", d=>sx(d.dx))
                .attr("height", d=>sy(d.y))
                .attr("fill", "steelblue");

            let gXaxis = d3.svg.axis().scale(sx).orient("bottom");
            canvas.append("g")
                .call(gXaxis)
                .attr("transform", "translate(5,"+(height+5)+")");

            bars.append("text")
                .attr("x", d=>sx(d.x))
                .attr("y", d=>height-sy(d.y))
                .attr("dx", d=>sx(d.dx)/2)
                .attr("text-anchor", "middle")
                .attr("dy",20)
                .attr("fill", "#000000")
                .text(d=>d.y);


        });
    }


    componentWillMount() {
        this.setState({name: "noname"});
        this.sample1();
        ;
    }
}


