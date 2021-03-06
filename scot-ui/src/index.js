import React from 'react';
import ReactDOM from 'react-dom';
import App from './main/index';
import registerServiceWorker from './registerServiceWorker';
import Switch from "react-router-dom/es/Switch";
import Route from "react-router-dom/es/Route";
import HashRouter from "react-router-dom/es/HashRouter";
import { SnackbarProvider } from 'notistack';

let customHistory = require('history').createBrowserHistory;

ReactDOM.render(<HashRouter history={customHistory()}>
  <SnackbarProvider >
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/:value' component={App} />
      <Route exact path='/:value/:id' component={App} />
      <Route exact path='/:value/:id/:id2' component={App} />
      <Route path='/:value/:type/:id/:id2' component={App} />
    </Switch>
  </SnackbarProvider>
</HashRouter>, document.getElementById('root'));