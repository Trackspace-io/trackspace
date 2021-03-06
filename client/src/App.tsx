import './App.css';

import Error from 'components/common/Error';
import Messages from 'components/gui/Messages';
import ParentDashboard from 'components/parent/Dashboard';
import StudentDashboard from 'components/student/Dashboard';
import Invitation from 'components/student/Invitation';
import TeacherDashboard from 'components/teacher/Dashboard';
import { useUsers } from 'controllers';
import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';

import { ResetPasswordConfirm, ResetPasswordSend } from './components/common/ResetPassword';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import { NavbarPublic } from './components/gui/Navbar';
import Profile from 'components/common/Profile';
import { SetRole } from 'components/common/SetRole';

const App: React.FC = () => {
  const Users = useUsers();

  const { loggedIn } = Users.current;

  React.useEffect(() => {
    Users.getCurrent();
  }, []);

  if (loggedIn === null) {
    return <div />;
  }

  return (
    <Router>
      <NavbarPublic />
      <Switch>
        {/* Public routes */}
        <Route exact path="/">
          {!Users.current.role ? <SignIn /> : <Redirect to={`/${Users.current.role}`} />}
        </Route>
        <Route path="/sign-up" component={SignUp} />
        <Route path="/reset-password/send" component={ResetPasswordSend} />
        <Route path="/reset-password/confirm" component={ResetPasswordConfirm} />

        {/* Private routes */}
        <ProtectedRoute role="all" exact path="/user/:firstName-:lastName" redirectPath="/">
          <Profile />
        </ProtectedRoute>
        <ProtectedRoute role="all" path="/user/:firstName-:lastName/public" redirectPath="/">
          <Profile />
        </ProtectedRoute>
        <ProtectedRoute role="all" path="/user/:firstName-:lastName/security" redirectPath="/">
          <Profile />
        </ProtectedRoute>

        {/* Teachers */}
        <ProtectedRoute role="teacher" path="/teacher" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>

        {/* Students */}
        <ProtectedRoute role="student" path="/student" redirectPath="/">
          <StudentDashboard />
        </ProtectedRoute>

        <Route path="/students/classrooms/invitations/accept" component={Invitation} />

        {/* Parents */}
        <ProtectedRoute role="parent" path="/parent" redirectPath="/">
          <ParentDashboard />
        </ProtectedRoute>

        {/* Unknown role (after Google sign-up) */}
        <ProtectedRoute role="unknown" path="/unknown" redirectPath="/">
          <SetRole />
        </ProtectedRoute>

        <Route path="*" component={Error} />
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
  exact?: boolean;
  role?: 'teacher' | 'student' | 'parent' | 'unknown' | 'all';
  path: string; // Path if condition succeeded
  redirectPath: string; // Redirect path if condition fails.
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = (props) => {
  const Users = useUsers();

  const { loggedIn, role } = Users.current;

  return loggedIn && (props.role === role || props.role === 'all') ? (
    <Route exact={props.exact} {...props} component={props.component} render={undefined} />
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
