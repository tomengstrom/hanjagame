import * as React from 'react';
import axios from 'axios';

const STORAGE_HOST = '//localhost:3000';

interface ToolbarProps {
    diagramEngine: null
    diagramModel: null
}

export class Toolbar extends React.Component<ToolbarProps, {}> {

__diagram_model: any
__diagram_engine: any
__serialized_model: any

public static defaultProps: ToolbarProps = {
    diagramEngine: null,
    diagramModel: null
}

constructor(props: ToolbarProps) {
    super(props);

    this.__diagram_model = props.diagramModel;
    this.__diagram_engine = props.diagramEngine;



}

// Save diagram model state
save_diagram() {
    this.__serialized_model = this.__diagram_model.serializeDiagram();
    console.log('saved diagram');
    console.log(this.__serialized_model);
    return;
}

// Revert to saved diagram model state
restore_diagram() {
    this.__diagram_model.deSerializeDiagram( this.__serialized_model, this.__diagram_engine );
    // FIXME should update the diagram after this
    return;
}

// Get saved diagram model from server
fetch_diagram() {
    // FIXME show progress
    console.log('getting json');
    axios.get( STORAGE_HOST + '/builder/get_diagram')
        .then( response => {
            console.log('diagram fetched, response is');
            console.log(response);
            var diagram_model = response.data.body;
            this.__diagram_model.deSerializeDiagram( diagram_model, this.__diagram_engine );
        });
    
}

// Save model to server
store_diagram() {
    // FIXME show progress
    var diagram = this.__diagram_model.serializeDiagram();
    console.log('sending json');
    console.log(diagram);

    axios.post( STORAGE_HOST + '/builder/save_diagram', diagram )        
        .then(response => {
            console.log('diagram saved, response is');
            console.log(response);
        });

    return;
}


render() {
    return (
    <div>
        <button onClick={this.save_diagram.bind(this)}>save this diagram</button>
        <button onClick={this.restore_diagram.bind(this)}>restore diagram</button>
        <button onClick={this.store_diagram.bind(this)}>save to file</button>
        <button onClick={this.fetch_diagram.bind(this)}>get from server</button>

    </div>
    );
}
}