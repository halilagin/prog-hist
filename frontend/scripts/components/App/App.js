import React, {Component} from 'react';

import {MyHist} from "../d3tut/MyHist"
import {ProgHist} from "../d3tut/ProgHist"
import {ProgHistControlPanel} from "../d3tut/ProgHistControlPanel"
import {ProgHistPiD} from "../d3tut/ProgHistPiD"
import {ProgHistClassicStreaming} from "../d3tut/ProgHistClassicStreaming"
import {ProgHistAnnotatedBins} from "../d3tut/ProgHistAnnotatedBins"
import {ProgHistAnnotatedBinsRibbons} from "../d3tut/ProgHistAnnotatedBinsRibbons"
import {ProgHistAnnotatedBinsWithUpperBinLimit} from "../d3tut/ProgHistAnnotatedBinsWithUpperBinLimit"
import {ProgHistAnnotatedBinsWithBinBudget} from "../d3tut/ProgHistAnnotatedBinsWithBinBudget"
import {ProgHistAnnotatedBinsWithClickBudget} from "../d3tut/ProgHistAnnotatedBinsWithClickBudget"
import {ParallelCoord} from "../d3tut/ParallelCoord"


import {FillArea} from "../d3tut/FillArea"
import {LineWrapper} from "../nvd3react/LineWrapper"
import {UserResponseTimes} from "../userevaluation/UserResponseTimes"


class App extends Component {
    progHist=null;

    render() {
        return (
            <div >
                {/*<div style={{position:'relative', float:"left",  width:"400px"}}><h2>Progressive Histogram</h2><ProgHist style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassic"></ProgHist></div>*/}
                <div style={{position:'relative', float:"left",  width:"600px"}}>
                  {/*<ProgHistAnnotatedBins ref={(progHist) => { this.progHist = progHist; }} distCount="2" type="AnnotatedHistogram" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBins>*/}
                  {/*<ProgHistAnnotatedBinsRibbons ref={(progHist) => { this.progHist = progHist; }} distCount="2" type="AnnotatedHistogram" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBinsRibbons>*/}
                  {/*<ProgHistAnnotatedBinsWithUpperBinLimit ref={(progHist) => { this.progHist = progHist; }} distCount="2" type="AnnotatedHistogram" upperBinCountLimit="20" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBinsWithUpperBinLimit>*/}
                  {/*<ProgHistAnnotatedBinsWithBinBudget ref={(progHist) => { this.progHist = progHist; }} distCount="2" type="AnnotatedHistogram" upperBinCountLimit="20" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBinsWithBinBudget>*/}
                  {/*<ProgHistAnnotatedBinsWithClickBudget ref={(progHist) => { this.progHist = progHist; }} distCount="2" type="AnnotatedHistogram" upperBinCountLimit="20" style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistAnnotatedBinsWithClickBudget>*/}
                  {/*<FillArea></FillArea>*/}
                  <ParallelCoord style={{position:'relative'}} mountClass="ProgHistClassicStreaming"></ParallelCoord>

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
