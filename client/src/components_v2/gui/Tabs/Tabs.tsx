import React, { ReactElement, useEffect } from 'react';
import { Tab } from './index';
import { useState } from 'react';

const Tabs: React.FC<{
  tab?: string;
}> = ({ children, tab }) => {
  const [tabs, setTabs] = useState<ReactElement[]>([]);
  const [currentTab, setCurrentTab] = useState<ReactElement | null>();

  useEffect(() => {
    setTabs(
      React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === Tab,
      ) as ReactElement[],
    );
  }, [children]);

  useEffect(() => {
    if (tabs.length > 0) {
      const tabWithName = tab && tabs.find((t) => t.props.name === tab);
      setCurrentTab(tabWithName || tabs[0]);
    }
  }, [tabs, tab]);

  return <>{currentTab}</>;
};

export default Tabs;
