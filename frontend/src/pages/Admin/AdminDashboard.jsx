import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useGetUsersQuery } from '../../redux/api/userApiSlice';
import { useGetTotalSaleByDateQuery, useGetTotalSalesQuery, useGetTotalOrdersQuery } from '../../redux/api/orderApiSlice';
import AdminMenu from './AdminMenu';
import Loader from '../../components/Loader';
import AdminOrderList from './AdminOrderList';

const AdminDashboard = () => {
  const { data: orders, isLoading: orderLoading } = useGetTotalOrdersQuery();
  const { data: customers, isLoading: userLoading } = useGetUsersQuery();
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: salesDetails } = useGetTotalSaleByDateQuery();

  const [chartType, setChartType] = useState(false); // true: bar, false: line
  const [state, setState] = useState({
    options: {
      chart: {
        type: 'line',
      },
      tooltip: {
        theme: 'light',
      },
      colors: ['#00E396'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Sales Trend',
        align: 'left',
      },
      grid: {
        borderColor: '#ccc',
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Date',
        },
      },
      yaxis: {
        title: {
          text: 'Sales',
        },
        min: 0,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [
      {
        name: 'Sales',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (salesDetails) {
      const formatSalesData = salesDetails.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formatSalesData.map((item) => item.x),
          },
        },
        series: [
          {
            name: 'Sales',
            data: formatSalesData.map((item) => item.y),
          },
        ],
      }));
    }
  }, [salesDetails, chartType]);

  const handleChartToggle = () => {
    setChartType(!chartType);
  };

  return (
    <>
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              PKR {salesLoading ? <Loader /> : sales?.totalSales?.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {userLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {orderLoading ? <Loader /> : orders?.total}
            </h1>
          </div>
        </div>

        {/* Chart Section */}
        <div className="ml-[10rem] mt-[4rem] flex items-center">
          {/* Styled Toggle Button */}
          <button
            onClick={handleChartToggle}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition duration-300 ease-in-out"
          >
            {chartType ? 'Show Line Chart' : 'Show Bar Chart'}
          </button>
        </div>

        <div className="ml-[10rem] mt-[2rem]">
          <Chart
            options={state.options}
            series={state.series}
            type={chartType ? 'bar' : 'line'}
            width="70%"
          />
        </div>

        {/* Orders List */}
        <div className="mt-[4rem]">
          <AdminOrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
