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
  const { user, authCheck, isAuthenticated } = useUser();
  console.log('isAuthenticated', isAuthenticated);

  React.useEffect(() => {
    authCheck(cookie);
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public routes */}
        {/* <Route exact path="/" component={SignIn} /> */}
        <ProtectedRoute condition={!Boolean(cookie)} exact path="/" redirectPath={`/${user?.role}`}>
          <SignIn />
        </ProtectedRoute>
        <Route path="/sign-up" component={SignUp} />
        <Route path="/reset-password/send" component={ResetPasswordSend} />
        <Route path="/reset-password/confirm" component={ResetPasswordConfirm} />

        {/* Private routes */}
        <ProtectedRoute condition={Boolean(cookie)} path="/user/:firstName-:lastName/" redirectPath="/">
          <Profile />
        </ProtectedRoute>
      </Switch>
      <Messages />
    </Router>
  );
};

/**
 * Component representing a route that requires authentication in order to be
 * accessed.
 */
interface IProtectedRouteProps extends RouteProps {
  condition: boolean; // Flag to verify if the user should be redirected
  path: string; // Path if condition succeeded
  redirectPath: string; // Redirect path if condition fails.
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = (props) => {
  return props.condition ? (
    <Route {...props} component={props.component} render={undefined} />
  ) : (
    <Redirect
      to={{
        pathname: props.redirectPath,
        state: {
          prevLocation: props.path, // Save previous path.
        },
      }}
    />
  );
};

export default App;
