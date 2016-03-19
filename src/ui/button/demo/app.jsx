/* eslint no-alert:0 */
import React from 'react';
import { render } from 'react-dom';

import Button from '../src/button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
    this.showIsLoading = this.showIsLoading.bind(this);
  }

  showIsLoading() {
    this.setState({
      isLoading: !this.state.isLoading
    });
  }


  render() {
    return (
      <div>
        <section>
          <h3>A clickable button with some extra classes</h3>
          <pre><code>
  <Button
    text="Click me!"
    clickHandler={function onClick() { alert('You clicked me!'); }}
    classes={['an', 'extra', 'class']}
  />
          </code></pre>
          <Button
            text="Click me!"
            clickHandler={function onClick() { alert('You clicked me!'); }}
            classes={['an', 'extra', 'class']}
          />
        </section>
        <section>
          <h3>A disabled button</h3>
          <pre><code>
  <Button
    text="Click me!"
    disabled
    clickHandler={function onClick() { alert('You clicked me!'); }}
  />
          </code></pre>
          <Button
            text="Click me!"
            disabled
            clickHandler={function onClick() { alert('You clicked me!'); }}
          />
        </section>
        <section>
          <h3>A button with a label on a dark background</h3>
          <pre><code>
  <Button
    text="Click me!"
    label="A button"
    theme="dark"
    clickHandler={function onClick() { alert('You clicked me!'); }}
  />
          </code></pre>
          <div style={
            {
              width: '100%',
              height: '45px',
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              text="Click me!"
              label="A button"
              theme="dark"
              clickHandler={function onClick() { alert('You clicked me!'); }}
            />
          </div>
        </section>
        <section>
          <h3>A button with a spinner</h3>
          <pre><code>
  <Button
    showSpinner
  />
          </code></pre>
          <div>
            <Button
              text="Delete all files"
              showSpinner={this.state.isLoading}
              clickHandler={this.showIsLoading}
            />
          </div>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
