import './App.css';

import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ResetPasswordConfirm, ResetPasswordSend } from './components/common/ResetPassword';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import Navbar from './components/gui/Navbar';
import Cookies from 'js-cookie';
import { UserProvider } from 'contexts/userContext';
import UserProfile from 'components/common/UserProfile';

const App: React.FC = () => {
  const cookie = Cookies.get('connect.sid');
  console.log('cookie', cookie);

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Switch>
          {/* Public routes */}
          <Route exact path="/" component={SignIn} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/reset-password/send" component={ResetPasswordSend} />
          <Route exact path="/reset-password/confirm" component={ResetPasswordConfirm} />
          <Route exact path="/user/:firstName-:lastName/" component={UserProfile} />
        </Switch>
      </Router>
    </UserProvider>
  );
};

// const Hello = (props: { who: string }) => <p> Hello {props.who} </p>;

export default App;
