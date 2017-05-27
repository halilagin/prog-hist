import * as React from 'react';



export class ProgHistControlPanel extends React.Component {



    setInterval(){

        this.setState({interval:3000});
        //alert(this.props.interval.value);
    }


    render() {
        return (
            <div>
                <label>Interval <input key="interval" index="interval" defaultValue={this.state.interval} /></label>
                <label> <button key="start" index="start"  onClick={this.setInterval} >Set</button></label>

                <label>Action <button key="start" index="start"  >Start</button></label>

            </div>
        );
    }


    componentWillReceiveProps(props) {
        this.setState({"ages":ages});

    }

     myrand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    componentWillMount() {
        this.state = {interval: 2000};
        alert(this.state.interval);
    }
}


