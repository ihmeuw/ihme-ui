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
    this.onClickAsync = this.onClickAsync.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggleLoading() {
    this.setState({
      isLoading: !this.state.isLoading,
    });
  }

  onClickAsync() {
    this.toggleLoading();
    setTimeout(this.toggleLoading, 2000);
  }

  render() {
    return (
      <div>
        <section>
          <h3>A clickable button with a new class</h3>
{/* <pre><code>
  <Button
    onClick={function onClick() { alert('You clicked me!'); }}
    className="new-class"
  >
    Click me!
  </Button>

</code></pre> */}
          <Button
            onClick={onClick}
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
    onClick={function onClick() { alert('You clicked me!'); }}
  />

</code></pre> */}
          <Button
            onClick={onClick}
            theme="green"
            text="Click me!"
          />
        </section>
        <section>
          <h3>A disabled button</h3>
{/* <pre><code>
  <Button
    disabled
    text="Click me!"
    onClick={function onClick() { alert('You clicked me!'); }}
  />

</code></pre> */}
          <Button
            disabled
            onClick={onClick}
            text="Click me!"
          />
        </section>
        <section>
          <h3>A button with a label</h3>
{/* <pre><code>
  <HtmlLabel text="A button">
    <Button
      text="Click me!"
      onClick={function onClick() { alert('You clicked me!'); }}
      theme="dark"
    />
  </HtmlLabel>

</code></pre> */}
          <HtmlLabel
            text="A button "
          >
            <Button
              onClick={onClick}
              text="Click me!"
            />
          </HtmlLabel>
        </section>
        <section>
          <h3>A button with a spinner</h3>
{/* <pre><code>
  <Button
    text="Delete all files"
    showSpinner={this.state.isLoading}
    onClick={this.showIsLoading}
  />

</code></pre> */}
          <div>
            <Button
              disabled={this.state.isLoading}
              onClick={this.onClickAsync}
              showSpinner={this.state.isLoading}
              text="Delete all files"
            />
          </div>
        </section>
        <section>
          <h3>A clickable button with an image</h3>
{/* <pre><code>
  <Button
    text="Click me!"
    onClick={function onClick() { alert('You clicked me!'); }}
    icon="home3.png"
  />

</code></pre> */}
          <Button
            icon="home3.png"
            onClick={onClick}
            text="Click me!"
          />
        </section>
        <section>
          <h3>A clickable button with an image which changes to a spinner when clicked</h3>
{/* <pre><code>
  <Button
    text="Click me!"
    icon="home3.png"
    showSpinner={this.state.isLoading}
    onClick={this.showIsLoading}
  />

</code></pre> */}
          <Button
            disabled={this.state.isLoading}
            icon="home3.png"
            onClick={this.onClickAsync}
            showSpinner={this.state.isLoading}
            text="Click me!"
          />
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
