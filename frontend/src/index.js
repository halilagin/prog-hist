import React from 'react';
import {render} from 'react-dom';

import App from './App';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.decapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

render(
    <App />,
    document.querySelectorAll('.h1bgraph')[0]
);

