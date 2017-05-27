import React, {Component} from 'react';
import * as d3 from 'd3';


export class ProgHist extends Component {

    render() {


        return (
            <div>


                <label>Bins Count <input ref="txtBinsCount" defaultValue={this.state.binsCount} /></label>

                <label>Interval <input ref="txtInterval" defaultValue={this.state.interval} />ms </label>
                <label> <button key="start" index="start"  onClick={this.startTimer.bind(this)} >Start</button></label>

                <label>Action <button key="start" index="start"  onClick={this.stopTimer.bind(this)} >Stop</button></label>
                <label><button key="refresh" index="refresh"  onClick={this.refresh.bind(this)} >Refresh</button></label>
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
        let timeInterval=1000;
        if (this.state!=null && this.state.interval!=null)
            timeInterval = this.state.interval;



        if (this.state.canvas==null)
            this.state.canvas = d3.select("."+this.state.mountClass).append("svg")
                .attr("width", this.state.width)
                .attr("height",this.state.height+this.state.padding)
                .append("g")
                .attr("transform", "translate(20,20)")
                ;



        this.state.timer = setInterval(()=>{this.loopDrawingProgHist();}
            ,timeInterval);

    }

    loopDrawingProgHist(){
        //alert(this.state.canvas);
        let chooseRand = this.myrand(0,2);
        let pieIdx = this.myrand(0,this.state.binsCount);

        this.state.canvas.selectAll("*").remove();
        this.state.canvas.append("text")
            .attr("x", d=>this.state.width/2-20)
            .attr("y", d=>this.state.height+this.state.padding*0.5)
            .attr("text-anchor", "middle")
            .attr("fill", "#000000")
            .text("prog-hist-classic");

        let newAges = this.state.ages;
        for (var i=0;i<10;i++){
            let r=0;
            if (chooseRand==0)
                r = Math.round(this.randFn25()());
            else if (chooseRand==1)
                r = Math.round(this.randFn50()());
            else
                r = Math.round(this.randFn75()());

            newAges.push(r);
        }
        this.setState({ages: newAges});

        let hist = d3.layout.histogram();
        let bins = hist.bins(this.state.binsCount)(this.state.ages);

        var sx = d3.scale.linear()
            .domain([0, d3.max(this.state.ages)])
            .range([0,this.state.width]);
        var sy = d3.scale.linear()
            .domain([0, d3.max(bins.map(d=>d.y))])
            .range([0, this.state.height]);
        //this.getBins(5,this.this.ages);

        let histVerLines =[{
            "x1":1,
            "y1":0,
            "x2":bins[0].x,
            "y2":bins[0].y
        }];
        for (var i=0;i<bins.length-1;i++) {
            histVerLines.push({
                "x1":bins[i].x+bins[i].dx,
                "y1":bins[i].y,
                "x2":bins[i+1].x,
                "y2":bins[i+1].y
            });
        }

        var bars = this.state.canvas.selectAll(".histhorline")
                .data(bins)
                .enter()
                .append("g")
            ;
        let scale = 5;
        bars.append("line")
            .classed("histhorline",true)
            .attr("x1", d=>sx(d.x) )
            .attr("y1", d=>this.state.height-sy(d.y))
            .attr("x2", d=>sx(d.x+d.dx))
            .attr("y2", d=>this.state.height-sy(d.y))
            .attr("fill", "none")
            .attr("stroke", "#33aade")
            .attr("stroke-width", "3");



        let gXaxis = d3.svg.axis().scale(sx).orient("bottom");
        this.state.canvas.append("g")
            .call(gXaxis)
            .attr("transform", "translate(5,"+(this.state.height+5)+")");

        bars.append("text")
            .attr("x", d=>sx(d.x))
            .attr("y", d=>this.state.height-sy(d.y))
            .attr("dx", d=>sx(d.dx)/2)
            .attr("text-anchor", "middle")
            .attr("dy",20)
            .attr("fill", "#000000")
            .text(d=>d.y);


        var histverlineG = this.state.canvas.selectAll(".histverline")
                .data(histVerLines)
                .enter()
                .append("line")
                .attr("class", (d,i)=>{return i==((pieIdx+5)%this.state.binsCount)?"histverline-dash":"histverline"; })
                .attr("x1", (d,i)=>sx(d.x1))
                .attr("y1", (d,i)=>this.state.height-sy(d.y1))
                .attr("x2", (d,i)=>sx(d.x2))
                .attr("y2", (d,i)=>this.state.height-sy(d.y2))
                .attr("fill", "none")
                .attr("stroke", (d,i)=>{return i==((pieIdx+5)%this.state.binsCount)?"purple":"#33aade"; })
                .attr("stroke-width", "3")
            ;


        let pie = [sx(bins[pieIdx].x+bins[pieIdx].dx/2), this.state.height-sy(bins[pieIdx].y), sx(bins[pieIdx].dx/2), 3];
        let up_down = this.myrand(0,1);
        this.drawPie(this.state.canvas, pie[0], pie[1], pie[2],pie[3],up_down==0?"up":"down", "red");

        let sinIdx = Math.abs(this.state.binsCount-pieIdx);
        if (sinIdx==pieIdx)
            sinIdx = ((sinIdx+1)%this.state.binsCount);

        let sinus = [sx(bins[sinIdx].x+bins[sinIdx].dx/4), this.state.height-sy(bins[sinIdx].y), sx(bins[sinIdx].dx/2), 3];

        this.drawSinus(this.state.canvas, sinus[0], sinus[1], sinus[2],sinus[3], "red");
        this.drawBoxplots(bars,sx, sy,this.state.height, "red");

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

    drawSinus(canvas, x,y,r,w, color){
        this.drawPie(canvas, x,y, r/2,w, "up",color);
        this.drawPie(canvas, x+r,y, r/2,w, "down", color);

    }



    initData(){
        this.refs={txtBinsCount:null, txtInterval:null};
        this.state = null;
        this.state = {
            interval: 1000,
            binsCount:30,
            ages:[],
            width:400,
            height:400,
            padding:80,
            canvas:null,
            timer:null,
            mountClass:"ProgHistClassic"
        };
        this.state.ages = [1, 5, 10, 12, 35, 75, 68, 2, 7, 10, 55, 40, 42, 86, 39, 16, 47, 61, 9, 14, 1, 5, 10, 10, 12, 35, 75, 64, 22, 28, 2, 7, 21, 59, 43, 42, 83, 39, 18, 47, 59, 8, 15];
    }
    componentWillMount() {
        this.initData();
        this.start();


    }
}


