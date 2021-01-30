import './App.css';

import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';

import { ResetPasswordConfirm, ResetPasswordSend } from './components/common/ResetPassword';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import Navbar from './components/gui/Navbar';
import Cookies from 'js-cookie';
import Profile from 'components/common/Profile';
import useUser from 'controllers/useUser';
import Messages from 'components/gui/Messages';

const App: React.FC = () => {
  const cookie = Cookies.get('connect.sid') || '';
  const { isAuthenticated, authCheck } = useUser();

  React.useEffect(() => {
    authCheck(cookie);
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public routes */}
        <Route exact path="/" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/reset-password/send" component={ResetPasswordSend} />
        <Route path="/reset-password/confirm" component={ResetPasswordConfirm} />
        {/* <Route path="/user/:firstName-:lastName/" component={Profile} /> */}
        <PrivateRoute isAuth={isAuthenticated} redirectPath="/" path="/user/:firstName-:lastName/">
          <Profile />
        </PrivateRoute>
      </Switch>
      <Messages />
    </Router>
  );
};

/**
 * Component representing a route that requires authentication in order to be
 * accessed.
 */
interface IPrivateRouteProps extends RouteProps {
  isAuth: boolean; // is authenticate route.
  redirectPath: string; // redirect path if don't authenticate route.
}

const PrivateRoute: React.FC<IPrivateRouteProps> = (props) => {
  return props.isAuth ? (
    <Route {...props} component={props.component} render={undefined} />
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state: {
          prevLocation: props.path,
          error: 'You need to login first!',
        },
      }}
    />
  );
};

export default App;
