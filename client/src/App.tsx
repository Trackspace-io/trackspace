import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/common/SignIn';
import Navbar from './components/gui/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public routes */}
        <Route exact path="/" component={SignIn} />
      </Switch>
    </Router>
  );
};

// const Hello = (props: { who: string }) => <p> Hello {props.who} </p>;

export default App;
