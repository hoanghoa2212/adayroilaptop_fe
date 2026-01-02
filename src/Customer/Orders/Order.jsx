import {Box, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import OrderCard from "./OrderCard";
import {useDispatch, useSelector} from "react-redux";
import {getOrderHistory} from "../../Redux/Customers/Order/Action";
import { useLocation,useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const orderStatus = [
    {label: "Đang chờ phê duyệt", value: "PENDING"},
    {label: "Đã xác nhận", value: "CONFIRMED"},
    {label: "Đang giao", value: "SHIPPED"},
    {label: "Đã giao", value: "DELIVERED"},
    {label: "Đã hủy", value: "CANCELLED"},
];

const Order = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const jwt = localStorage.getItem("jwt");
    const {order} = useSelector(store => store);
    const [status, setStatus] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page')?? 1;

    console.log('order',page);

    const handlePaginationChange = (event, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("page", value);
        const query = searchParams.toString();
        navigate({ search: `?${query}` });
      };

    useEffect(() => {
        dispatch(getOrderHistory(status,page));
        if(!jwt){
navigate('/')
        }
    }, [jwt,status,page]);
    return (
        <Box className="px-10">
            <Grid container spacing={0} sx={{justifyContent: "space-between"}}>
                <Grid item xs={2.5} className="">
                    <div className="h-auto shadow-lg bg-white border p-5 sticky top-5">
                        <h1 className="font-bold text-lg">Lọc trạng thái đơn hàng</h1>
<div className="space-y-4 mt-10">
    <div className="flex items-center">
        <input
            type="radio"
            name="status"
            value=""
            onChange={() => setStatus('')}
            checked={status === ''}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-3 text-sm text-gray-600">Tất cả</label>
    </div>
                            {orderStatus.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        defaultValue={option.value}
                                        type="radio"
                                        name="status"
                                        onChange={(e)=>setStatus(e.target.value)}
                                        defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        className="ml-3 text-sm text-gray-600"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <Box className="space-y-5 ">
                        {order.orders?.content?.length > 0 ?
                       order.orders?.content?.map((order) => {
                        return order?.orderItems?.map((item, index) => <OrderCard item={item} order={order}/>)
                    }) :
                    <div className="mx-auto px-4 py-5 flex justify-center">Không có đơn hàng nào</div>
                    }
                    </Box>
                    <section className="w-full px-[3.6rem]">
                        <div className="mx-auto px-4 py-5 flex justify-center rounded-md">
                            <Pagination
                            count={order.orders?.totalPages}
                            color="primary"
                            className=""
                            onChange={handlePaginationChange}
                            />
                        </div>
                    </section>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Order;

