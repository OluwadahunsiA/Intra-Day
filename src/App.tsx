import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { data } from './data';

import 'chart.js/auto';
import { ChartOptions } from 'chart.js';
import './App.css';

type RawDataType = {
  [key: string]: {
    [key: string]: string;
  };
};

function App() {
  const [chartData, setChartData] = useState<RawDataType[] | null>(null);

  const fetchData = async () => {
    // const response = await fetch(
    //   `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${`RIBXT3XYLI69PC0Q`}`
    // );

    // const data = await response.json();

    const obj: RawDataType = data['Time Series (5min)'];

    const responseArray = Array.from(Object.keys(obj), (key: string) => {
      //extract time from the object key
      const keyValue = key.split(' ')[1];

      //extract the nested object
      const rawPropertyValue = obj[key];

      const objectKeys = Object.keys(rawPropertyValue);

      // remove numbers from the nested object keys

      const editedObject = {
        [objectKeys[0].split(' ')[1]]: rawPropertyValue[objectKeys[0]],
        [objectKeys[1].split(' ')[1]]: rawPropertyValue[objectKeys[1]],
        [objectKeys[2].split(' ')[1]]: rawPropertyValue[objectKeys[2]],
        [objectKeys[3].split(' ')[1]]: rawPropertyValue[objectKeys[3]],
        [objectKeys[4].split(' ')[1]]: rawPropertyValue[objectKeys[4]],
      };

      //return formatted object

      return { [keyValue]: editedObject };
    });

    setChartData(responseArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const extractChartValue = (property: string) => {
    return chartData?.map((entry) => {
      console.log(entry);
      const value = Object.values(entry)[0][property];

      return value;
    });
  };

  const labels = chartData?.map((entry) => Object.keys(entry));

  const openData = extractChartValue('open');
  const closeData = extractChartValue('close');
  const highData = extractChartValue('high');
  const lowData = extractChartValue('low');
  const volumeDataArr = extractChartValue('volume');

  const openAndCloseData = {
    labels: labels,
    datasets: [
      {
        label: 'open',
        data: openData,
        borderColor: 'green',
        backgroundColor: 'green',
        yAxisID: 'y',
      },
      {
        label: 'close',
        data: closeData,
        borderColor: 'red',
        backgroundColor: 'red',
        yAxisID: 'y',
      },
    ],
  };

  const highAndLowData = {
    labels: labels,
    datasets: [
      {
        label: 'high',
        data: highData,
        borderColor: 'green',
        backgroundColor: 'green',
        yAxisID: 'y',
      },
      {
        label: 'low',
        data: lowData,
        borderColor: 'red',
        backgroundColor: 'red',
        yAxisID: 'y',
      },
    ],
  };

  const volumeData = {
    labels: labels,
    datasets: [
      {
        label: 'volume',
        data: volumeDataArr,
        borderColor: 'blue',
        backgroundColor: 'blue',
        yAxisID: 'y',
      },
    ],
  };

  return (
    <>
      <h1>Open And Close Data</h1>
      <Line data={openAndCloseData} options={options} />

      <h1>High And Low Data</h1>

      <Line data={highAndLowData} options={options} />

      <h1>Volume Data</h1>
      <Line data={volumeData} options={options} />
    </>
  );
}

export default App;
