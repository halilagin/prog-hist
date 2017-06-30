import React, {Component} from 'react';

import {MyHist} from "../d3tut/MyHist"
import {ProgHist} from "../d3tut/ProgHist"
import {ProgHistControlPanel} from "../d3tut/ProgHistControlPanel"
import {ProgHistPiD} from "../d3tut/ProgHistPiD"
import {ProgHistClassicStreaming} from "../d3tut/ProgHistClassicStreaming"
import {ProgHistAnnotatedBins} from "../d3tut/ProgHistAnnotatedBins"
import {ExperimentIntroduction} from "../d3tut/ExperimentIntroduction"

import {LineWrapper} from "../nvd3react/LineWrapper"
import {UserResponseTimes} from "../userevaluation/UserResponseTimes"


class App extends Component {
    progHist=null;

    render() {
        return (
            <div >
                {/*<div style={{position:'relative', float:"left",  width:"400px"}}><h2>Progressive Histogram</h2><ProgHist style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassic"></ProgHist></div>*/}
                <div style={{position:'relative', float:"left",  width:"400px"}}>
                  {/*<ExperimentIntroduction></ExperimentIntroduction>*/}
                  {/*<ProgHistClassicStreaming style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistClassicStreaming>*/}
                  {/*type="ClassicHistogram" || "AnnotatedHistogram" <ProgHistAnnotatedBins ref={(progHist) => { this.progHist = progHist; }} type="AnnotatedHistogram" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBins>*/}
                  <ProgHistAnnotatedBins ref={(progHist) => { this.progHist = progHist; }} type="AnnotatedHistogram" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBins>

                  {/*<LineWrapper name="wrapper"/>*/}
                </div>
                <div style={{display:"none"}}>
                  <button key="parentClick"  onClick={this.parentButtonClicked.bind(this)} >parentClick</button>
                </div>

                {/*<div style={{position:'relative',float:"right",width:"400px"}}><h2>Progressive Histogram PiD</h2><ProgHistPiD style={{position:'relative'}} name="dummyname" mountClass="ProgHistPiD"></ProgHistPiD></div>*/}
                {/*<ProgHistControlPanel></ProgHistControlPanel>*/}
            </div>

        );
    }

  parentButtonClicked(){
    //this.progHist.alertTest();
    this.progHist.toggleDisplay();
  }

  componentDidMount() {
    // x is now 'hello'
  }

}


export default App;
