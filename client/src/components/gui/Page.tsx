/* eslint-disable @typescript-eslint/no-explicit-any */

import style from '../../styles/gui/Page.module.css';

import React, { ReactElement, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Sidebar';
import Typography from './Typography';

/**
 * Component representing a page. There must be at least one Content component in this component's children. Each
 * content tag defines a content that can be shown on this page. A navbar is automatically generated to navigate
 * through the different contents of the page.
 */
const Page: React.FC<{
  path: string;
  title?: string;
  icon?: ReactElement;
}> = ({ children, path, title }) => {
  const [contents, setContents] = useState<any[]>([]);

  useEffect(() => {
    setContents(
      React.Children.toArray(children).filter((c) => {
        return (c as any)?.type?.name === Content.name;
      }),
    );
  }, [children]);

  return (
    <div className={style['container'] + ' ' + (contents.length > 1 ? style['container-navbar'] : '')}>
      {contents.length > 1 && <PageNav title={title} path={path} contents={contents} />}
      <div className={style['content']}>
        <Switch>
          {contents.map((content, index) => (
            <Route key={index} path={`${path}${content.props?.path ?? ''}`}>
              {content}
            </Route>
          ))}
          <Route path="" exact>
            <Redirect to={`${path}${contents[0]?.props?.path ?? ''}`} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

/**
 * Component representing a group of pages. Its child element can either be of type Page or PageGroup.
 */
const PageGroup: React.FC<{
  path: string;
  title?: string;
}> = ({ children, path }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(
      React.Children.toArray(children).filter((c) => {
        return [Page.name, PageGroup.name].includes((c as any)?.type?.name);
      }),
    );
  }, [children]);

  return (
    <Switch>
      {items.map((item, index) => (
        <Route key={index} path={`${path}${item.props?.path ?? ''}`}>
          {item.type.name === Page.name ? (
            <Page {...item.props} path={`${path}${item.props?.path}`}>
              {item.props?.children}
            </Page>
          ) : item.type.name === PageGroup.name ? (
            <PageGroup {...item.props} path={`${path}${item.props?.path}`}>
              {item.props?.children}
            </PageGroup>
          ) : (
            <></>
          )}
        </Route>
      ))}
      <Route path="" exact>
        <Redirect to={`${path}${items[0]?.props?.path ?? ''}`} />
      </Route>
    </Switch>
  );
};

/**
 * Component reprenting the content of a page. A page can have multiple contents. In this case, a navbar will be
 * automatically generated to navigate through the different contents.
 */
const Content: React.FC<{
  title?: string;
  icon?: ReactElement;
  path?: string;
}> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Component representing the navbar on the left of the page.
 */
const PageNav: React.FC<{
  title?: string;
  path: string;
  contents: any[];
}> = ({ title, path, contents }) => {
  return (
    <div className={style['navbar']}>
      <div className={style['title']}>
        <Typography variant="subtitle" display="inline" weight="light">
          {title}
        </Typography>
      </div>
      <Sidebar>
        {contents.map((content, index) => (
          <SidebarItem key={index} icon={content.props?.icon} to={`${path}${content.props?.path ?? ''}`}>
            {content.props?.title}
          </SidebarItem>
        ))}
      </Sidebar>
    </div>
  );
};

export { Page, PageGroup, Content };
