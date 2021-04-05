import { useClassroomsAsStudent } from 'controllers';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import style from './Weekly.module.css';

interface IGraphProps {
  studentId: string;
  termId: string;
}

const Graph: React.FC<IGraphProps> = ({ termId, studentId }) => {
  // Controllers
  const Classrooms = useClassroomsAsStudent();

  // States
  const { progresses, terms } = Classrooms;
  const { graph } = progresses;

  const [showGraph, setShowGraph] = React.useState<boolean>(false);

  React.useEffect(() => {
    studentId &&
      progresses.getProgressGraph({
        termId,
        studentId,
      });
  }, [studentId, terms.currentTerm?.id]);

  return (
    <React.Fragment>
      <div className={style['toggle']}>
        {!showGraph ? (
          <FiToggleLeft onClick={() => setShowGraph(true)} />
        ) : (
          <FiToggleRight onClick={() => setShowGraph(false)} />
        )}
      </div>
      {!showGraph && graph.data && (
        <div className={style['graph']}>
          <Line
            data={{
              labels: graph.data.labels.map((label: string) => `  ${label}`),
              datasets: graph.data.datasets.map((set: any) => {
                return {
                  label: set.label,
                  backgroundColor: `#${set.backgroundColor}`,
                  borderColor: `#${set.borderColor}`,
                  data: set.data.map((point: any) => point),
                  fill: set.fill,
                  borderWidth: set.borderWidth,
                };
              }),
            }}
            width={70}
            height={30}
            options={{
              maintainAspectRatio: true,
              responsive: true,
              tooltips: { mode: 'index', intersect: false },
              hover: { mode: 'nearest', intersect: true },
              scales: {
                xAxes: [{ gridLines: { display: false } }],
                yAxes: [
                  {
                    gridLines: { display: true },
                    ticks: { precision: 0, beginAtZero: true },
                  },
                ],
              },
              legend: {
                labels: {
                  padding: 40, //default is 10
                  boxWidth: 60,
                  usePointStyle: true,
                },
                display: true,
                position: 'bottom',
                align: 'end',
              },
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Graph;
