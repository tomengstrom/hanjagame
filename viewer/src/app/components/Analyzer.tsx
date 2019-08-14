import * as React from 'react';
import axios from 'axios';
import { Debug } from '../Debug';

const STORAGE_HOST = '//localhost:3000';

interface AnalyzerProps {
}
interface AnalyzerState {
    input_value: string
}
Debug.enable_scope('Analyzer');
export class Analyzer extends React.Component<AnalyzerProps, AnalyzerState> {
    
    constructor(props: AnalyzerProps) {
        super(props);
        this.state = {
            input_value: ''
        };
    }

    onChange(event: any) {
        this.setState({input_value: event.target.value});
    }

    click() {
        axios.post( STORAGE_HOST + '/analyze', {
            sentence: this.state.input_value
          }).then( (response: any) => {
              Debug.log('Analyzer', 'analyzed sentence', response);
        });
    }

    render() {
        return (
            <div>
                <input
                    type='text'
                    onChange={this.onChange.bind(this)}></input>
                <button onClick={this.click.bind(this)}>Analyze</button>
            </div>
        )
    }

}