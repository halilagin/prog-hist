import React, {Component} from 'react';
import NVD3Chart from 'react-nvd3'
import * as axios from 'axios';

export class RealDataBarChart extends Component {



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
      let data = [{"key":"real data", "values":[]}];
      for (var i=0;i<this.state.data.length;i++){
        data[0].values.push({"label":"A", "value":this.state.data[i]});
      }
      var chart;
      var context = {
        getColor: function(i){
          var colors = d3.scale.category20().range().slice(10);

          return colors[Math.floor(Math.random() * colors.length)];
        }
      };

      chart = <NVD3Chart context={context} color={{name:'getColor', type:'function'}} tooltip={{enabled: true}} type="discreteBarChart" datum={data} x="value" y="label" />;

      return (
        <div>
          {chart}
        </div>
      );
    }
    else {
      return (<div>Loading...</div>)
    }
  }
}
