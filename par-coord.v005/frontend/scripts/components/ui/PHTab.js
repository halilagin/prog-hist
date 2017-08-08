import React, {Component} from 'react';
import NVD3Chart from 'react-nvd3'
import * as axios from 'axios';
import {MyHist} from "../d3tut/MyHist"
import {ProgHist} from "../d3tut/ProgHist"
import {ProgHistControlPanel} from "../d3tut/ProgHistControlPanel"
import {ProgHistPiD} from "../d3tut/ProgHistPiD"
import {ProgHistClassicStreaming} from "../d3tut/ProgHistClassicStreaming"
import {LineWrapper} from "../nvd3react/LineWrapper"
export class PHTab extends Component {


  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  componentWillMount() {

  }


  render() {


    return (

      <div id="exTab2" class="container">
        <ul class="nav nav-tabs">
          <li class="active">
            <a  href="#1" data-toggle="tab">User Input</a>
          </li>
          <li><a href="#2" data-toggle="tab">User Evaluation</a>
          </li>
          <li><a href="#3" data-toggle="tab">Solution</a>
          </li>
        </ul>

        <div class="tab-content ">
          <div class="tab-pane active" id="1">
            <div style={{position:'relative', float:"left",  width:"400px"}}>
              <h2>Progressive Histogram Streaming</h2>
              <ProgHistClassicStreaming style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistClassicStreaming>
              {/*<LineWrapper name="wrapper"/>*/}
            </div>

          </div>
          <div class="tab-pane" id="2">
            <div id="lineChart"></div>



          </div>
          <div class="tab-pane" id="3">

          </div>
        </div>
      </div>

    )
  }

}
