import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as SRD from "storm-react-diagrams";

import './builder.scss';

import { Hello } from './components/Hello';
import { Toolbar } from './components/Toolbar';

import { DiamondNodeModel } from "./components/custom/DiamondNodeModel";
import { DiamondNodeFactory } from "./components/custom/DiamondNodeFactory";
import { SimplePortFactory } from "./components/custom/SimplePortFactory";
import { DiamondPortModel } from "./components/custom/DiamondPortModel";

declare let module: any

class DiagramComponent extends React.Component {
    __engine: any
    __model: any

    constructor(props: any) {
      super(props);
      
  
      // 1) setup the diagram engine
      var engine = new SRD.DiagramEngine();
      engine.installDefaultFactories();
  
        // 1.2 egister some extra factories 
        engine.registerPortFactory(new SimplePortFactory("diamond", config => new DiamondPortModel()));
        engine.registerNodeFactory(new DiamondNodeFactory());
  
      // 2) setup the diagram model
      var model = new SRD.DiagramModel();
  
      // 3) create a default node
      var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
      let port1 = node1.addOutPort("Out");
      node1.setPosition(100, 100);
  
      //3-B) create our new custom node
      var node3 = new DiamondNodeModel();
      node3.setPosition(250, 108);
  
      // 4) create another default node
      var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
      let port2 = node2.addInPort("In");
      node2.setPosition(400, 100);
  
      // 5) link the ports
      let link1 = port1.link(port2);
  
      // 6) add the models to the root graph
      model.addAll(node1, node2, node3, link1);
      // 7) load model into engine
      engine.setDiagramModel(model);
  
      this.__engine = engine;
      this.__model = model;
  
    }
  
    get_engine() {
      return this.__engine;
    }
  
    get_model() {
      return this.__model;
    }
  
    render() {
      return (
        <SRD.DiagramWidget diagramEngine={this.__engine} />
      );
    }
  }
  
  
  
  class Builder extends React.Component {
    __diagram: any
    constructor(props: any) {
      super(props);
      this.__diagram = new DiagramComponent(props);
    }
  
    render() {
      return (
        <div className="builder">

          <div className="builder-toolbar">
            <Toolbar
              diagramEngine={this.__diagram.get_engine()}
              diagramModel={this.__diagram.get_model()}
            />
          </div>
  
          <div className="builder-diagram">{this.__diagram.render()}</div>
   
        </div>
      );
    }
  }
  
  ReactDOM.render(
    <Builder />,
    document.getElementById('root')
  );
  
if (module.hot) {
    module.hot.accept();
 }