import './App.css';

import Error from 'components/common/Error';
import Profile from 'components/common/Profile';
import Messages from 'components/gui/Messages';
import TeacherDashboard from 'components/teacher/Dashboard';
import StudentDashboard from 'components/student/Dashboard';
import useUser from 'controllers/useUser';
import Cookies from 'js-cookie';
import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';

import { ResetPasswordConfirm, ResetPasswordSend } from './components/common/ResetPassword';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import { Navbar } from './components/gui/Navbar';
import Invitation from 'components/student/Invitation';
import { useTeachers, useUsers } from './controllers/index';

const App: React.FC = () => {
  const cookie = Cookies.get('connect.sid') || '';
  const User = useUser();
  const Teachers = useTeachers();
  const Users = useUsers();

  console.log('Teachers', Teachers);
  console.log('Users', Users);

  React.useEffect(() => {
    Users.authCheck(cookie);
    User.authCheck(cookie);
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public routes */}
        <ProtectedRoute condition={!Boolean(cookie)} exact path="/" redirectPath={`/${User.current.role}`}>
          <SignIn />
        </ProtectedRoute>
        <Route path="/sign-up" component={SignUp} />
        <Route path="/reset-password/send" component={ResetPasswordSend} />
        <Route path="/reset-password/confirm" component={ResetPasswordConfirm} />

        {/* Private routes */}
        <ProtectedRoute condition={Boolean(cookie)} path="/user/:firstName-:lastName" redirectPath="/">
          <Profile />
        </ProtectedRoute>

        {/* Teachers */}
        <ProtectedRoute condition={Boolean(cookie)} exact path="/teacher" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>
        <ProtectedRoute condition={Boolean(cookie)} path="/teacher/classrooms" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>
        <ProtectedRoute condition={Boolean(cookie)} path="/teacher/classrooms/:id" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>
        <ProtectedRoute condition={Boolean(cookie)} path="/teacher/classrooms/:id/students" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>
        <ProtectedRoute condition={Boolean(cookie)} path="/teacher/classrooms/:id/subjects" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>
        <ProtectedRoute condition={Boolean(cookie)} path="/teacher/classrooms/:id/terms" redirectPath="/">
          <TeacherDashboard />
        </ProtectedRoute>

        {/* Students */}
        <ProtectedRoute condition={Boolean(cookie)} path="/student" redirectPath="/">
          <StudentDashboard />
        </ProtectedRoute>
        <Route path="/students/classrooms/invitations/accept" component={Invitation} />

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
