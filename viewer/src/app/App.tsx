import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Narrative } from './components/Narrative';

import './viewer.scss';

declare let module: any
  
class Viewer extends React.Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="viewer">
        <Narrative />
      </div>
    );
  }
}

ReactDOM.render(
  <Viewer />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}