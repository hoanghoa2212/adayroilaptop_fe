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
        // --- RESPONSIVE UPDATE: w-full thay vì w-[15rem] ---
        <div onClick={handleNavigate} className='laptopCard w-full bg-white border rounded-lg overflow-hidden m-0 transition-all cursor-pointer hover:shadow-lg flex flex-col h-full'>
            <div className="h-[10rem] sm:h-[13rem] w-full flex justify-center items-center p-2 bg-gray-50">
                <img
                    className="object-contain w-full h-full"
                    src={`${API_BASE_URL}${laptop.imageUrls[0]}`}
                    alt={laptop?.model}
                />
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex flex-wrap items-center space-x-2 mb-1">
                        <p className="text-xs text-gray-500 line-through">{laptop?.price?.toLocaleString('vi-VN')} đ</p>
                        <span className="text-red-500 text-xs font-bold bg-red-100 px-1 rounded">-{laptop?.discountPercent}%</span>
                    </div>
                    <p className="text-black font-bold text-sm sm:text-base mb-1">
                        {((100-laptop?.discountPercent)*laptop?.price/100)?.toLocaleString('vi-VN')} đ
                    </p>
                </div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2" title={laptop?.model}>
                    {laptop?.model}
                </h4>
            </div>
        </div>
    );
};

export default LaptopCard;