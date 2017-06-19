import React, {Component} from 'react';
import NVD3Chart from 'react-nvd3'
import * as axios from 'axios';

export class UserResponseTimes extends Component {

  getDatum(j) {
    var userResponseTimes = [];

    for (var i = 0; i < 100; i++) {
      userResponseTimes.push({x: i, y: Math.sin(i / j)});

    }

    return userResponseTimes;
  }

  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  componentWillMount() {
    console.log("componentWillMount.start");
    let url = "http://localhost:5000/proghist/streaming/userinteractiondata/6/";
    axios.get(url)
      .then((resp) => {
        var userResponseTimes = [];
        let clicks = resp.data.clicks;
        for (var i = 0; i < clicks.length; i++) {
          let time_ = 0;
          if (i != 0)
            time_ = clicks[i].time; //first row stores the initial time. remaining rows are referenced to this row's time.
          userResponseTimes.push({x: time_, y: clicks[i].binCount});
        }
        this.setState({'data': userResponseTimes});
        console.log("init.userResponseTimes.data", userResponseTimes);

      });

  }


  render() {

    if (this.state.data) {
      let maxX = 0;
      const data = [{
        values: this.state.data,
        key: 'User Responses',
        color: '#ff7f0e'
      }];
      maxX = d3.max(this.state.data, d=> d.x);
      maxX += maxX/20.0;
      maxX = maxX * 1.5;
      console.log("render.data", data);

      return (

        <div>

          {

            React.createElement(NVD3Chart, {
              xAxis: {
                tickFormat: function (d) {
                  return d;
                },
                axisLabel: 'Time (ms)'
              },
              yAxis: {
                tickFormat: function (d) {
                  return parseFloat(d).toFixed(2);
                },
                axisLabel:'Bin count'
              },
              xDomain: [0, maxX],
              type: 'lineChart',
              datum: data,
              x: 'label',
              y: 'value',
              duration: 1,
              margin: {
                left: 200
              },
              renderEnd: function () {
                console.log('renderEnd');
              }
            })
          }
        </div>
      )
    }
    else {
      return (<div>Loading...</div>)
    }
  }
}
