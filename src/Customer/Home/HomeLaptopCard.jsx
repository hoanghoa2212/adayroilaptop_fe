import React from "react";
import {useNavigate} from "react-router-dom";

const HomeLaptopCard = ({laptop}) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/PC/${laptop?.id || laptop?._id || 2}`)}

            className="cursor-pointer flex flex-col bg-white rounded-lg shadow-md border overflow-hidden w-[15rem] mx-auto transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 h-full min-h-[24rem]"
        >
            {}
            <div className="h-[13rem] w-full flex justify-center items-center p-2">
                <img
                    className="object-contain h-full w-full max-h-[12rem]"
                    src={laptop?.imageUrl}
                    alt={laptop?.model}
                />
            </div>

            {}
            <div className="p-4 flex flex-col gap-2 flex-1">
                {}
                <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 line-through">
                        {laptop?.originalPrice?.toLocaleString('vi-VN')} VND
                    </p>
                    <span className="text-red-500 text-xs font-bold bg-red-100 px-1 rounded">
                        -{laptop?.discountPercent?.toLocaleString('vi-VN')}%
                    </span>
                </div>
                <p className="text-black font-bold text-base">
                    {laptop?.discountedPrice?.toLocaleString('vi-VN')} VND
                </p>

                {}
                {}
                <h4
                    className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]"
                    title={laptop?.model}
                >
                    {laptop?.model}
                </h4>
            </div>
        </div>
    );
};

export default HomeLaptopCard;