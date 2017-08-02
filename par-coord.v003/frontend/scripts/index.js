import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';


render(
  <App />,
  document.querySelectorAll('.appContainer')[0]
);

//
// var RenderedHistogram = render(
//   <ProgHistAnnotatedBins />,
//   document.querySelectorAll('.h1bgraph')[0]
// );

// render(
//   <LineWrapper name="wrapper"/>,
//   document.getElementById('lineChart')
// );


// render(
//   <UserResponseTimes name="wrapper"/>,
//   document.getElementById('lineChart')
// );


// render(
//   <PHTab />,
//   document.querySelectorAll('.h1bgraph')[0]
// );



// render(
//   <D3RealDataBarChart name="wrapperRealDataBarChart"/>,
//   document.getElementById('RealDataBarChart')
// );
