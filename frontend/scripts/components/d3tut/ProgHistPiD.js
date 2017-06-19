import React, {Component} from 'react';
import * as d3 from 'd3';


export class ProgHistPiD extends Component {

    render() {
        return (
            <div>
                <label>Bins Count <input ref="txtBinsCount" defaultValue={this.state.binsCount} /></label>

                <label>Interval <input ref="txtInterval" defaultValue={this.state.interval} />ms </label>
                <label> <button key="start" index="start"  onClick={this.startTimer.bind(this)} >Start</button></label>

                <label>Action <button key="start" index="start"  onClick={this.stopTimer.bind(this)} >Stop</button></label>
                <label><button key="refresh" index="refresh"  onClick={this.refresh.bind(this)} >Refresh</button></label>
                <label><button key="runUpdateLayer1" index="runUpdateLayer1"  onClick={this.runLayer2.bind(this)} >runUpdateLayer1</button></label>

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

    streamData() {

        const url = "http://localhost:5000/test/ch8_10"
        fetch(url)
            .then(response => {
                //alert(response.data);
                response.json().then(value=> console.log(value.mu));
            })
            .catch(error => {
                console.log("error", error);
            });

    }
    loopDrawingProgHist(){
        this.streamData();
        //alert(this.state.canvas);
        let chooseRand = this.myrand(0,2);

        this.state.canvas.selectAll("*").remove();
        this.state.canvas.append("text")
            .attr("x", d=>this.state.width/2-20)
            .attr("y", d=>this.state.height+this.state.padding*0.5)
            .attr("text-anchor", "middle")
            .attr("fill", "#000000")
            .text("prog-hist-pid");

        let newAges = this.state.ages;
            let r=0;
            if (chooseRand==0)
                r = Math.round(this.randFn25()());
            else if (chooseRand==1)
                r = Math.round(this.randFn50()());
            else
                r = Math.round(this.randFn75()());

            newAges.push(r);
        this.setState({ages: newAges});
        console.log("ages.in.loop",this.state.ages);
        let hist = d3.layout.histogram();
        //let bins = hist.bins(this.state.binsCount)(this.state.ages);
       // console.log("bins",bins);

        this.updateLayer1(this.state.pid.step,this.state.ages[this.state.ages.length-1],
            this.state.pid.breaks,
            this.state.pid.counts,
            this.state.pid.breaks.length,
            this.state.pid.alpha,
            this.state.ages.length-1);
        let layer2Bins = this.doLayer2(this.state.pid.counts,
        this.state.pid.breaks,
        this.state.pid.groupCountInLayer2);



        let bins = this.state.pid.resultBin;
        console.log("pid.resultBin",bins);
        console.log("pid.x.max",this.state.pid.maxValue);
        console.log("pid.y.max",this.state.pid.maxCount);
        var sx = d3.scale.linear()
            .domain([0, this.state.pid.maxValue])
            .range([0,this.state.width]);
        var sy = d3.scale.linear()
            .domain([0, this.state.pid.maxCount])
            .range([0, this.state.height]);
        //this.getBins(5,this.this.ages);

        let histVerLines =[{
            "x1":0,
            "y1":0,
            "x2":this.state.pid.resultBin[0].x,
            "y2":this.state.pid.resultBin[0].y
        }];
        for (var i=0;i<bins.length-1;i++) {
            histVerLines.push({
                "x1":this.state.pid.resultBin[i].x+this.state.pid.resultBin[i].dx,
                "y1":this.state.pid.resultBin[i].y,
                "x2":this.state.pid.resultBin[i+1].x,
                "y2":this.state.pid.resultBin[i+1].y
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
            .attr("x1", d=>{return sx(d.x); })
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

        let pieIdx = this.myrand(0,bins.length);

        var histverlineG = this.state.canvas.selectAll(".histverline")
                .data(histVerLines)
                .enter()
                .append("line")
                .attr("class", (d,i)=>{return i==((pieIdx+5)%bins.length)?"histverline-dash":"histverline"; })
                .attr("x1", (d,i)=>sx(d.x1))
                .attr("y1", (d,i)=>this.state.height-sy(d.y1))
                .attr("x2", (d,i)=>sx(d.x2))
                .attr("y2", (d,i)=>this.state.height-sy(d.y2))
                .attr("fill", "none")
                .attr("stroke", (d,i)=>{return i==((pieIdx+5)%bins.length)?"purple":"#33aade"; })
                .attr("stroke-width", "3")
            ;

        let pie = [sx(bins[pieIdx].x+bins[pieIdx].dx/2), this.state.height-sy(bins[pieIdx].y), sx(bins[pieIdx].dx/2), 3];
        let up_down = this.myrand(0,1);
        this.drawPie(this.state.canvas, pie[0], pie[1], pie[2],pie[3],up_down==0?"up":"down", "red");

        let sinIdx = Math.abs(bins.length-pieIdx);
        if (sinIdx==pieIdx)
            sinIdx = ((sinIdx+1)%bins.length);

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
            mountClass:"ProgHistPiD",
            pid:{
                breaks:[],
                counts:[],
                alpha : 0.33,
                step:5,
                intervalCount:10,
                groupCountInLayer2:3,
                resultBin:[],
                maxValue:0,
                minValue:0,
                range:0,
                totalCount:0,
                maxCount:0
            }

        };
        this.state.ages = [1, 5, 10, 12, 35, 75, 68, 2, 7, 10, 55, 40, 42, 86, 39, 16, 47, 61, 9, 14, 1, 5, 10, 10, 12, 35, 75, 64, 22, 28, 2, 7, 21, 59, 43, 42, 83, 39, 18, 47, 59, 8, 15];

        this.runLayer2();

        console.log("ages",this.state.ages);
    }
    componentWillMount() {
         this.initData();
        this.start();
    }


    updateLayer1(step, x, breaks, counts, NrB, alfa, Nr){

        let k=0, minx=0, maxx=0;


        if (x<breaks[0]) {
            k=0;
            minx = x;
        }else if (x>breaks[NrB-1]) {
            k=NrB-2;
            maxx = x;
        }else  {
            k=2+Math.ceil((x-breaks[0])/step);
        }


        while(breaks[k]==undefined) k=k-1;

        while(x<breaks[k] && k>0) k=k-1;
        while(breaks[k+2]!=undefined && x>breaks[k+2] && (k+2)<breaks.length) k=k+1;

        counts[k] = 1+counts[k];
        Nr = 1+Nr;

        if (((1+counts[k])/(Nr+2)) > alfa) {
            let val = counts[k]/2;
            counts[k] = val;

            if (k==0) {
                //breaks.push(breaks[0]-step);
                breaks.splice( 0, 0, breaks[0]-step );
                counts.splice(0,0,val);
            } else {
                if (k==NrB-1) {
                    breaks.push(breaks[NrB-1]+step);
                    counts.push(val);
                } else {
                    breaks.splice(k, 0, (breaks[k]+breaks[k+1])/2 );
                    counts.splice(k, 0, val );
                }
            }
            NrB = NrB+1
        }

    }

    runLayer2(){
        for (var i=0;i<this.state.pid.intervalCount;i++){
            this.state.pid.breaks.push((i+2)*this.state.pid.step);
            if (i<(this.state.pid.intervalCount-1))
                this.state.pid.counts.push(0);
        }
        for (var i=0;i<this.state.ages.length;i++){
            this.updateLayer1(this.state.pid.step,this.state.ages[i],
                this.state.pid.breaks,
                this.state.pid.counts,
                this.state.pid.breaks.length,
                this.state.pid.alpha,
                i);

        }
        let layer2Bins = this.doLayer2(this.state.pid.counts,
             this.state.pid.breaks,
             this.state.pid.groupCountInLayer2);
    }

    doLayer2(counts, breaks, groupCountInLayer2){
        //var MAX_INT = 4294967295;
       // alert(Number.MIN_VALUE);
       // alert(Number.MAX_VALUE);
        console.log("dolayer2.counts:",counts);
        this.trimZeroes(counts, breaks);
        let layer2Bin = []
        //group into k*groupCountInLayer2 = counts.length. in layer 1 we have counts.length bins but in layer2 we have k=counts.length/groupCountInLayer2 bins.
        let totalCount=0;
        let maxCount=0;
        for (var i=0;i<counts.length;i+=groupCountInLayer2){
            let k=0;
            let bin={y:0,x:0,dx:0, length:0, max:Number.MIN_VALUE,min:Number.MAX_VALUE};

            let min_=0,max_=0;
            for(var k=0; k<groupCountInLayer2; k++) {
                let idx = i+k;
                if (counts[idx]==undefined || breaks[idx]==undefined)
                    break;
                if (breaks[idx]>bin.max)
                    bin.max = breaks[idx];
                if (breaks[idx]<bin.min)
                    bin.min = breaks[idx];

                //console.log("i,counts[idx]",idx,counts[idx]);
                bin.x = bin.min;
                bin.length = bin.length + counts[idx];
                bin.y = bin.length;
            }
            bin.dx = bin.max-bin.min;
            layer2Bin.push(bin);
            totalCount = totalCount+1;
            if (bin.y>maxCount)
                maxCount = bin.y;
        }

        this.state.pid.resultBin = layer2Bin;

        this.state.pid.minValue = breaks[0];
        this.state.pid.maxValue = breaks[breaks.length-1];
        this.state.pid.range = this.state.pid.maxValue - this.state.pid.minValue;
        this.state.pid.totalCount = totalCount;
        this.state.pid.maxCount = maxCount;
        return layer2Bin;
    }

    trimZeroes(counts, breaks){

        //left-trim
        for (var i=0;i<counts.length;i++){
            if (counts[i]==undefined || counts[i]==Math.NaN || counts[i]==0){
                counts.splice(i,0);
                breaks.splice(i,0);
            } else
                break;//break in first non-zero
        }

        //right-trim
        for (var i=counts.length-1;i>-1;i--){
            if (counts[i]==undefined || counts[i]==Math.NaN || counts[i]==0){
                counts.splice(i,0);
                breaks.splice(i,0);
            } else
                break;//break in first non-zero
        }
    }
}


