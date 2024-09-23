import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchDailySales, DaySale } from '../../api';  // Import the API fetch function

const options = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: true,
      },
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],  // We'll populate this dynamically
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    tickAmount: 5,
    labels: {
      formatter: (value: number) => {
        return value.toFixed(2);
      },
    },
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const SalesChart: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Total Sales',
        data: [],  // We'll populate this dynamically
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartOptions, setChartOptions] = useState(options);

  useEffect(() => {
    const getDailySales = async () => {
      try {
        const salesData: DaySale[] = await fetchDailySales();
        
        // Map the fetched data to the chart format
        const categories = salesData.map((sale) => sale.date) as any ;
        const sales = salesData.map((sale) => Math.round(sale.total_sales * 100) / 100);

        // Update the chart state with the fetched data
        setState({
          series: [
            {
              name: 'Total Sales',
              data: sales,
            },
          ],
        });
        // Update the categories (x-axis) in the chart options
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories,
            tooltip: {
              enabled: true,
          },
          },
        }));

      } catch (err) {
        setError('Failed to fetch daily sales data');
      } finally {
        setLoading(false);
      }
    };

    getDailySales();
  }, []);

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Sales</p>
              <p className="text-sm font-medium">Date Range</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={chartOptions as any}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

