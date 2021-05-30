import { NavbarProtected } from 'components/gui/Navbar';
import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useUsers } from 'controllers';
import React from 'react';
import { FcInfo, FcLock } from 'react-icons/fc';
import { Redirect, Route, Switch } from 'react-router';
import style from './Profile.module.css';
import Public from './Public';
import Security from './Security';

const Profile: React.FC = () => {
  // Controllers
  const Users = useUsers();

  return (
    <div className={style['container']}>
      <NavbarProtected />
      <div className={style['body']}>
        <nav className={style['nav']}>
          <span className={style['title']}>
            <Typography variant="subtitle" display="inline" weight="light">
              Profile
            </Typography>
          </span>
          <Sidebar>
            <SidebarItem
              to={`/user/${Users.current?.firstName?.toLowerCase()}-${Users.current?.lastName?.toLowerCase()}/public`}
              icon={<FcInfo />}>
              Public
            </SidebarItem>
            <SidebarItem
              to={`/user/${Users.current?.firstName?.toLowerCase()}-${Users.current?.lastName?.toLowerCase()}/security`}
              icon={<FcLock />}>
              Security
            </SidebarItem>
          </Sidebar>
        </nav>
        <main className={style['main']}>
          <Switch>
            <Route exact path={`/user/:firstName-:lastName`}>
              <Redirect
                to={`/user/${Users.current?.firstName?.toLowerCase()}-${Users.current?.lastName?.toLowerCase()}/public`}
              />
            </Route>
            <Route
              path={`/user/:firstName-:lastName/public`}
              render={(props) => <Public {...props} update={Users.update} current={Users.current} />}
            />
            <Route
              path={`/user/:firstName-:lastName/security`}
              render={(props) => <Security {...props} update={Users.update} />}
            />
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default Profile;
