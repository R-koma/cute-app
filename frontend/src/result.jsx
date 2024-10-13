import '.result.css';
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@d3/bubble-chart/2";

const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));


function Result() {
    return (
      <div className="App">
        <header className="navbar">
          <div className="logo">
            <h1>znisa</h1>
          </div>
          <div className="nav-links">
            <a href="#portfolio">Portfolio</a>
            <a href="#hireme">Hire Me</a>
          </div>
        </header>
  
        <section className="hero">
          <h2>I design top notch websites</h2>
          <p>I'll design your website and will develop to land it on internet using No-code.</p>
          <button>Hire me</button>
        </section>
  
        <section className="what-i-do">
          <h3>What I do?</h3>
          <div className="cards">
            <div className="card yellow">
              <h4>Pen/Paper</h4>
              <p>User Research Design</p>
            </div>
            <div className="card blue">
              <h4>Figma</h4>
              <p>UI & Product Design</p>
            </div>
            <div className="card pink">
              <h4>Webflow</h4>
              <p>No-code Development</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  export default App;
  