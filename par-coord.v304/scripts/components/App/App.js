import React, {Component} from 'react';

import {ParallelCoord} from "../d3tut/ParallelCoord"

class App extends Component {

    render() {
        return (
            <div >
                {/*<div style={{position:'relative', float:"left",  width:"400px"}}><h2>Progressive Histogram</h2><ProgHist style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassic"></ProgHist></div>*/}
                <div style={{position:'relative', float:"left",  width:"600px"}}>
                  <ParallelCoord style={{position:'relative'}} mountClass="ProgHistClassicStreaming"></ParallelCoord>
                </div>
                <div style={{display:"none"}}>
                </div>
            </div>

        );
    }

  componentDidMount() {

  }

}


export default App;
