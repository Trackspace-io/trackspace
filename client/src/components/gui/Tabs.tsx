import * as React from 'react';

interface ITabsProps {
  children: React.ReactElement;
}

const Tabs: React.FC<ITabsProps> = ({ children }) => {
  return (
    <div>
      <ul>
        {React.Children.map(children, (child: React.ReactElement<ITabProps>, i) => (
          <TabTitle key={i} title={child.props.title} />
        ))}
      </ul>
      {children}
    </div>
  );
};

interface ITabProps {
  title: string;
}

const Tab: React.FC<ITabProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface ITabTitleProps {
  title: string;
}

const TabTitle: React.FC<ITabTitleProps> = ({ title }) => {
  return (
    <li>
      <button>{title}</button>
    </li>
  );
};

export { Tabs, Tab };
