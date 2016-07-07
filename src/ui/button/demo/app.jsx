/* eslint-disable no-alert */
import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../src/button';
import HtmlLabel from '../../html-label';

function onClick() { alert('You clicked me!'); }

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
    this.showIsLoading = this.showIsLoading.bind(this);
  }

  showIsLoading() {
    this.setState({
      isLoading: !this.state.isLoading,
    });
  }

  render() {
    return (
      <div>
        <section>
          <h3>A clickable button with a new class</h3>
{/* <pre><code>
  <Button
    clickHandler={function onClick() { alert('You clicked me!'); }}
    className="new-class"
  >
    Click me!
  </Button>

</code></pre> */}
          <Button
            clickHandler={onClick}
            className="new-class"
          >
            Click me!
          </Button>
        </section>
        <section>
          <h3>A themed button</h3>
{/* <pre><code>
  <Button
    theme="green"
    text="Click me!"
    clickHandler={function onClick() { alert('You clicked me!'); }}
  />

</code></pre> */}
          <Button
            theme="green"
            text="Click me!"
            clickHandler={onClick}
          />
        </section>
        <section>
          <h3>A disabled button</h3>
{/* <pre><code>
  <Button
    disabled
    text="Click me!"
    clickHandler={function onClick() { alert('You clicked me!'); }}
  />

</code></pre> */}
          <Button
            text="Click me!"
            disabled
            clickHandler={onClick}
          />
        </section>
        <section>
          <h3>A button with a label</h3>
{/* <pre><code>
  <HtmlLabel text="A button">
    <Button
      text="Click me!"
      clickHandler={function onClick() { alert('You clicked me!'); }}
      theme="dark"
    />
  </HtmlLabel>

</code></pre> */}
          <HtmlLabel
            text="A button "
          >
            <Button
              text="Click me!"
              clickHandler={onClick}
            />
          </HtmlLabel>
        </section>
        <section>
          <h3>A button with a spinner</h3>
{/* <pre><code>
  <Button
    text="Delete all files"
    showSpinner={this.state.isLoading}
    clickHandler={this.showIsLoading}
  />

</code></pre> */}
          <div>
            <Button
              text="Delete all files"
              showSpinner={this.state.isLoading}
              clickHandler={this.showIsLoading}
            />
          </div>
        </section>
        <section>
          <h3>A clickable button with an image</h3>
{/* <pre><code>
  <Button
    text="Click me!"
    clickHandler={function onClick() { alert('You clicked me!'); }}
    icon="home3.png"
  />

</code></pre> */}
          <Button
            text="Click me!"
            clickHandler={onClick}
            icon="home3.png"
          />
        </section>
        <section>
          <h3>A clickable button with an image which changes to a spinner when clicked</h3>
{/* <pre><code>
  <Button
    text="Click me!"
    icon="home3.png"
    showSpinner={this.state.isLoading}
    clickHandler={this.showIsLoading}
  />

</code></pre> */}
          <Button
            text="Click me!"
            icon="home3.png"
            showSpinner={this.state.isLoading}
            clickHandler={this.showIsLoading}
          />
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
