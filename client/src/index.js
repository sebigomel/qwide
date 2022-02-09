import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
html,
body {
    padding: 0;
    margin: 0;
}

body {
  height: 100vh;
  font-family: 'Noto Sans', sans-serif;
}

@media only screen and (min-width: 320px) {
  body { 
     font-size: 14px; 
  }
}
@media only screen and (max-width: 320px) {
  body { 
     font-size: 12px; 
  }
}
@media only screen and (min-width: 480px) {
  body { 
     font-size: 16px; 
  }
}
@media only screen and (min-width: 768px) {
  body { 
     font-size: 18px; 
  }
}
@media only screen and (min-width: 1024px) {
  body { 
     font-size: 20px; 
  }
}
@media only screen and (min-width: 1200px) {
  body { 
     font-size: 22px; 
  }
}
@media only screen and (min-width: 1200px) {
  body { 
     font-size: 24px; 
  }
}

a {
    color: inherit;
    text-decoration: none;
}

* {
    box-sizing: border-box;
}

`;

ReactDOM.render(
  <>
    <GlobalStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
  document.getElementById("root")
);
