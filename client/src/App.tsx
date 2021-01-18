import './App.css';

import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ResetPasswordConfirm, ResetPasswordSend } from './components/common/ResetPassword';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import Navbar from './components/gui/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public routes */}
        <Route exact path="/" component={SignIn} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/reset-password/send" component={ResetPasswordSend} />
        <Route exact path="/reset-password/confirm" component={ResetPasswordConfirm} />
      </Switch>
    </Router>
  );
};

// const Hello = (props: { who: string }) => <p> Hello {props.who} </p>;

export default App;
