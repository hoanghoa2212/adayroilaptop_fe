import React from 'react';
import "./LaptopCard.css";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../../Config/api";

const LaptopCard = ({laptop}) => {

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/PC/${laptop?.id || laptop?._id || 2}`)
    }

    return (
        <div onClick={handleNavigate} className='laptopCard max-w-[15rem] w-full border m-3 transition-all cursor-pointer '>
            <div className="h-[13rem] w-full flex">
                <img
                    className="object-cover object-top w-full h-full"
                    src={`${API_BASE_URL}${laptop.imageUrls[0]}`}
                    alt={laptop?.model}
                />
            </div>
            <div className="p-4 ">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 line-through">{laptop?.price?.toLocaleString('vi-VN')} VND</p>
                    <span className="text-gray-500 font-bold">-{laptop?.discountPercent?.toLocaleString('vi-VN')}%</span>
                </div>
                <p className="text-black-500 font-bold">
                    {((100-laptop?.discountPercent)*laptop?.price/100)?.toLocaleString('vi-VN')} VND
                </p>
                <h4 className="text-lg font-medium text-gray-900">
                    {laptop?.model}
                </h4>
            </div>
        </div>
    );
};

export default LaptopCard;

