import React from 'react'
import Chart from 'react-apexcharts'
import { useGetUsersQuery } from '../../redux/api/userApiSlice'
import { useGetTotalSaleByDateQuery , useGetTotalSalesQuery , useGetTotalOrdersQuery } from '../../redux/api/orderApiSlice'
import { useState , useEffect } from 'react'
import AdminMenu from './AdminMenu'
import Loader from '../../components/Loader'
import AdminOrderList from './AdminOrderList'
const AdminDashboard = () => {
    const {data: orders ,isLoading: orderLoading} = useGetTotalOrdersQuery();
    const {data: customers , isLoading: userLoading } = useGetUsersQuery();
    const {data: sales , isLoading: salesLoading } = useGetTotalSalesQuery();
    const {data: salesDetails  } = useGetTotalSaleByDateQuery();

    const [state , setState] = useState({
        options: {
            chart : {
                type: 'line',
            },
            tooltip: {
                theme:'light'
            },
            colors: ['#00E396'],
            dataLabels: {
                enabled: true
            },
            stroke:{
                curve: "smooth",
            },
            title:{
                text: 'Sales Trend',
                align: 'left'
            },
            grid:{
                borderColor: '#ccc'
            },
            markers:{
                size: 1,
            },
            xaxis:{
                categories: [],
                title:{
                    text: "Date"
                }
            },
            yaxis:{
                title:{
                    text: "Sales"
                }, 
                min: 0,
            }, 
            legend:{
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },
        series: [
            {
                name:'Sales',
                date: []
            }
        ]
    });

    useEffect(() =>{
        if(salesDetails){
            const formatSalesDate = salesDetails.map((item) =>({
                x: item._id,
                y:item.totalSales
            }))

            setState((prevState) => ({
                ...prevState,
                options:{
                    ...prevState.options,
                    xaxis:{
                        categories: formatSalesDate.map((item) => item.x)
                    }
                },
                series:[
                    {
                        name:"Sales" ,
                        data: formatSalesDate.map((item) => item.y)
                    }
                ]

            }))
        }
    },[salesDetails])
    

  return (
    <>
        <AdminMenu/>
        <section className='xl:ml-[4rem] md:ml-[0rem]'>
            <div className='w-[80%] flex justify-around flex-wrap'>
                <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
                        $   
                    </div>
                    <p className="mt-5">Sales</p>
                    <h1 className="text-xl font-bold">
                        PKR {salesLoading ? <Loader/> :
                        sales.totalSales.toFixed(2)
                        }
                    </h1>
                </div>
                <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
                        $   
                    </div>
                    <p className="mt-5">Customers</p>
                    <h1 className="text-xl font-bold">
                         {salesLoading ? <Loader/> :
                        customers?.length
                        }
                    </h1>
                </div>
                <div className="rounded-lg bg-black text-white p-5 w-[20rem] mt-5">
                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
                        $   
                    </div>
                    <p className="mt-5">All Orders</p>
                    <h1 className="text-xl font-bold">
                        {salesLoading ? <Loader/> :
                        orders?.total
                        }
                    </h1>
                </div>
            </div>
            <div className='ml-[10rem] mt-[4rem]'>
                 <Chart options={state.options} series={state.series} type= 'bar' width='70%' />       
            </div>

            <div className='mt-[4rem]'>
                <AdminOrderList/>        
            </div>
        </section>
    </>
  )
}

export default AdminDashboard