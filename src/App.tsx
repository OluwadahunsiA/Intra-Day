import { useEffect, useState } from 'react';
import { Chart } from './components/Chart';

import './App.css';

type RawDataType = {
  [key: string]: {
    [key: string]: string;
  };
};

type MetaDataType = {
  [key: string]: string;
};

function App() {
  const [chartData, setChartData] = useState<RawDataType[] | null>(null);
  const [metaData, setMetaData] = useState<MetaDataType | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${
          import.meta.env.VITE_API_KEY || 'RIBXT3XYLI69PC0Q'
        }`
      );
      const data = await response.json();

      const metaData = data['Meta Data'];

      console.log(metaData);

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
      setMetaData(metaData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const extractChartValue = (property: string) => {
    return chartData?.map((entry) => {
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
      <h1 className='flex justify-center mt-5 text-light-blue font-bold font-50px text-3xl'>
        TIME SERIES INTRADAY CHARTS
      </h1>

      <div className='flex justify-center mt-10'>
        <h2 className='text-xl'>
          <span className='font-bold  '>Last Refreshed:</span>
          {metaData && metaData['3. Last Refreshed']}
        </h2>
      </div>

      <div className=' m-10'>
        <Chart title='Open And Close Data' data={openAndCloseData} />

        <Chart title='High And Low Data' data={highAndLowData} />

        <Chart title='Volume ' data={volumeData} />
      </div>
    </>
  );
}

export default App;
