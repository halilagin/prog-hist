import React, {Component} from 'react';

import {MyHist} from "../d3tut/MyHist"
import {ProgHist} from "../d3tut/ProgHist"
import {ProgHistControlPanel} from "../d3tut/ProgHistControlPanel"
import {ProgHistPiD} from "../d3tut/ProgHistPiD"
import {ProgHistClassicStreaming} from "../d3tut/ProgHistClassicStreaming"


class App extends Component {

    render() {
        return (
            <div >
                {/*<div style={{position:'relative', float:"left",  width:"400px"}}><h2>Progressive Histogram</h2><ProgHist style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassic"></ProgHist></div>*/}
                <div style={{position:'relative', float:"left",  width:"400px"}}><h2>Progressive Histogram Streaming</h2><ProgHistClassicStreaming style={{position:'relative'}} name="dummyname" mountClass="ProgHistClassicStreaming"></ProgHistClassicStreaming></div>

                {/*<div style={{position:'relative',float:"right",width:"400px"}}><h2>Progressive Histogram PiD</h2><ProgHistPiD style={{position:'relative'}} name="dummyname" mountClass="ProgHistPiD"></ProgHistPiD></div>*/}
                {/*<ProgHistControlPanel></ProgHistControlPanel>*/}
            </div>

        );
    }

}


export default App;
