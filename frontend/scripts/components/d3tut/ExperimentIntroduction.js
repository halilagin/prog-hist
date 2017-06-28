import React, {Component} from 'react';
import * as d3 from 'd3';
import * as axios from 'axios';
//import Reveal from 'react-reveal'; // this package
//import 'animate.css/animate.css'; // CSS animation effects library
import * as Reveal from 'reveal.js'


export class ExperimentIntroduction extends Component {

    render() {


        return (
          <div>
            <div className="ExpIntro">
                welcome!
              {/*<Reveal effect="animated fadeInUp">*/}
                {/*<div>Markup that will be revealed on scroll</div>*/}
              {/*</Reveal>*/}

            </div>
          </div>
        );
    }


    show(){
      this.state.visible = true;
      this.setState(this.state);
    }

    hide(){
      this.state.visible = false;
      this.setState(this.state);
    }

    toggleDisplay(){
      this.state.visible = !this.state.visible;
      this.setState(this.state);
    }



  initData(){
        this.refs={txtBinsCount:null, txtInterval:null, txtBinCountGuess:null};
        this.state = null;
        this.state = {
          visible:true
        };
        this.setState(this.state);
        //Reveal.initialize();

    }
    componentWillMount() {
        this.initData();

    }
}


