import React from 'react';
import ReactDOM from 'react-dom';
import { PureComponent } from '../../../utils';

import Spinner from '../';

class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Spinner style={{ fontSize: 'medium' }} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
