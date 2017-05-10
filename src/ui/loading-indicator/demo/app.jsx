import React from 'react';
import { render } from 'react-dom';

import LoadingIndicator from '../';

function App() {
  return (
    <div>
      <LoadingIndicator style={{ fontSize: 'medium' }} />
    </div>
  );
}

render(<App />, document.getElementById('app'));
