import { createEnhancedStore, NO_EFF } from 'sudetenwaltz';
import { withHistory, UrlChanged, Push } from 'sudetenwaltz/enhancers/withHistory';
import { withLogging } from 'sudetenwaltz/enhancers/withLogging';
import { createBrowserHistory } from 'history';
import { NEVER } from 'rxjs';
import { render } from 'react-dom';
import * as React from 'react';
import { App } from './App/App';
import { createLink, RequestUrlChange } from './utils/Link';

const history = createBrowserHistory();

const store = createEnhancedStore<number, UrlChanged | RequestUrlChange>(
  withHistory(history),
  withLogging
)(
  [4, NO_EFF],
  (prevState, action) => {
    switch (action.type) {
      case 'UrlChanged':
        return [prevState + 1, NO_EFF]
      case 'RequestUrlChange':
        return [prevState, new Push(action.location)]
    }
  },
  () => NEVER
)

export const Link = createLink(history, store.dispatch)

store.state$.subscribe(state => {
  render(<App state={state}></App>, document.getElementById('root'))
})