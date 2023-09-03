import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Fragment } from 'react';
import './App.css';
import ConversationList from './components/ConversationList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Route exact path='/'>
          <ConversationList />
        </Route>
      </Router>
    </Fragment>
  );
}

export default App;
