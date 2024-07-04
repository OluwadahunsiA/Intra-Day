import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

import 'chart.js/auto';
import { FC } from 'react';

type DataType = {
  labels: string[][] | undefined;
  datasets: {
    label: string;
    data: string[] | undefined;
    borderColor: string;
    backgroundColor: string;
    yAxisID: string;
  }[];
};

const options: ChartOptions<'line'> = {
  responsive: true,
  elements: {
    line: {
      tension: 0.4,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  maintainAspectRatio: true,
};

export const Chart: FC<{ data: DataType; title: string }> = ({
  data,
  title,
}) => {
  return (
    <div className='flex flex-col w-[70%] items-center  mx-auto'>
      <h1 className='justify-center m-5 text-2xl'>{title}</h1>
      <Line data={data} options={options} />
    </div>
  );
};
