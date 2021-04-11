import Graph from 'components/common/Graph/Graph';
import React from 'react';

import style from './Goals.module.css';

interface IGoalGraphProps {
  graph: any;
}

const GoalGraph: React.FC<IGoalGraphProps> = ({ graph }) => {
  return <div className={style['graph-container']}>{graph && <Graph graph={graph} />}</div>;
};

export default GoalGraph;
