/* eslint-disable @typescript-eslint/no-explicit-any */

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Home.module.css';

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownSection, DropdownTrigger } from './Dropdown';
import { useAuths, useNotifications, useUsers } from 'controllers';
import { Content, Page, PageGroup } from './Page';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { Notifications } from './Notifications';

/**
 * Component representing the home page of a user. The home page can display multiple pages (see the Page component).
 * This component has two parts: a navbar on the left to navigate through the pages and a panel which displays the
 * current page.
 */
const Home: React.FC<{
  path: string;
}> = ({ children, path }) => {
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    setPages(
      React.Children.toArray(children).filter((c) => {
        return [Page.name, PageGroup.name].includes((c as any)?.type?.name);
      }),
    );
  }, [children]);

  return (
    <div className={style['container']}>
      <SideNav basePath={path} pages={pages} />
      <Panel basePath={path} pages={pages} />
    </div>
  );
};

/**
 * Navigation bar loacted at the left of the panel.
 */
const SideNav: React.FC<{
  basePath: string;
  pages: any[];
}> = ({ basePath, pages }) => {
  const [selectedPage, setSelectedPage] = useState<number>(-1);

  return (
    <div className={style['sidenav']}>
      {pages.map((page, index) => {
        const isGroup = page.type.name === PageGroup.name;
        const isSelected = selectedPage === index;

        return (
          <SideNavItem
            key={index}
            basePath={basePath}
            page={page}
            selected={isSelected}
            onClick={() => {
              setSelectedPage(isSelected && isGroup ? -1 : index);
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Component representing an item in the navigation bar.
 */
const SideNavItem: React.FC<{
  basePath: string;
  page: any;
  selected: boolean;
  onClick: () => void;
}> = ({ basePath, page, selected, onClick }) => {
  const [selectedSubPage, setSelectedSubPage] = useState<number>(-1);

  switch (page.type?.name) {
    // Regular page
    case Page.name:
      return (
        <Link
          to={`${basePath}${page.props?.path}`}
          className={style[page.props?.icon ? 'icon' : 'bubble-circle']}
          onClick={onClick}>
          {page.props?.icon ? <>{page.props.icon}</> : page.props?.title[0]}
        </Link>
      );

    // Page Group
    case PageGroup.name:
      return (
        <>
          {/* Page group button */}
          <div className={style[page.props?.icon ? 'icon' : 'bubble-square']} onClick={onClick}>
            {page.props?.icon ? <>{page.props.icon}</> : page.props?.title[0]}
          </div>
          {/* Render one button for each sub-page */}
          {selected &&
            (page.props?.children as any[]).map((item, index) => {
              const isSelected = selectedSubPage === index;

              return (
                <SideNavItem
                  key={index}
                  basePath={`${basePath}${page.props?.path}`}
                  page={item}
                  onClick={() => {
                    setSelectedSubPage(isSelected ? -1 : index);
                  }}
                  selected={isSelected}
                />
              );
            })}
        </>
      );

    // Unknown type
    default:
      return <></>;
  }
};

/**
 * Panel used to display the pages.
 */
const Panel: React.FC<{
  basePath: string;
  pages: any[];
}> = ({ basePath, pages }) => {
  return (
    <div className={style['panel']}>
      <PanelHeader />
      <PanelBody basePath={basePath} pages={pages} />
    </div>
  );
};

/**
 * Header of the panel
 */
const PanelHeader: React.FC = () => {
  const Users = useUsers();
  const Auths = useAuths();
  const Notifs = useNotifications();

  const userName = `${Users.current?.firstName ?? ''} ${Users.current?.lastName ?? ''}`;
  const userNameDashCase = userName.trim().toLowerCase().replaceAll(' ', '-');

  return (
    <div className={style['header']}>
      <div className={style['header-left']}>
        <img src={logo} className={style['logo']} />
      </div>
      <div className={style['header-right']}>
        <Dropdown orientation="right">
          <DropdownTrigger>
            {userName}
            {Notifs.list.length > 0 && <span className={style['notif-badge']} />}
          </DropdownTrigger>
          <DropdownSection title="Actions">
            <DropdownItem link={`/user/${userNameDashCase}`}>
              <FiUser /> Profile
            </DropdownItem>
            <DropdownItem onClick={Auths.logout}>
              <FiLogOut /> Logout
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Notifications">
            <DropdownItem>
              <Notifications />
            </DropdownItem>
          </DropdownSection>
        </Dropdown>
      </div>
    </div>
  );
};

/**
 * Body of the panel.
 */
const PanelBody: React.FC<{
  basePath: string;
  pages: any[];
}> = ({ basePath, pages }) => {
  const [defaultPath, setDefaultPath] = useState<string>('');

  useEffect(() => {
    setDefaultPath(pages[0]?.props?.path ?? '');
  }, [pages]);

  return (
    <div className={style['content']}>
      <Switch>
        {defaultPath && (
          <Route exact path={basePath}>
            <Redirect to={`${basePath}${defaultPath}`} />
          </Route>
        )}
        {pages.map((page: any, index: number) => (
          <Route key={index} path={`${basePath}${page?.props?.path}`}>
            {page.type.name === Page.name ? (
              <Page {...page.props} path={`${basePath}${page.props?.path}`}>
                {page.props?.children}
              </Page>
            ) : page.type.name === PageGroup.name ? (
              <PageGroup {...page.props} path={`${basePath}${page.props?.path}`}>
                {page.props?.children}
              </PageGroup>
            ) : (
              <></>
            )}
          </Route>
        ))}
      </Switch>
    </div>
  );
};

export { Home, Page, Content };
