import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox } from "@mui/material";
import { getCart } from "../../Redux/Customers/Cart/Action";
import { setSelectedCartItems } from "../../Redux/Customers/Order/Action";
import CartItem from "./CartItem";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const { cart } = useSelector(store => store.cart);
    const [selectedItems, setSelectedItems] = useState([]);

    const calculateTotalPrice = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cart.find((i) => i.id === itemId);
            const itemPrice = item?.laptopPrice * (100 - item?.discountPercent) / 100 || 0;
            return total + (itemPrice * item?.quantity);
        }, 0);
    };
    const calculateTotalItem = () => {
        return selectedItems.reduce((total, itemId) => {
            const item = cart.find((i) => i.id === itemId);
            return total + item?.quantity;
        }, 0);
    };

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItem, setTotalItem] = useState(0);

    useEffect(() => {
        dispatch(getCart(jwt));
        if (!jwt) {
            navigate('/');
        }
    }, [jwt, dispatch]);

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleCheckout = () => {
        const itemsToCheckout = cart.filter((item) => selectedItems.includes(item.id));
        dispatch(setSelectedCartItems(itemsToCheckout));
        navigate("/checkout?step=2");
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cart.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.map((item) => item.id));
        }
    };

    useEffect(() => {
        setTotalPrice(calculateTotalPrice());
        setTotalItem(calculateTotalItem());
    }, [selectedItems, cart]);

    const totalQuantity = selectedItems.length;

    return (
        <div className="pb-20 lg:pb-0"> {/* Padding bottom để tránh bị footer che mất nội dung */}
            {cart?.length > 0 ? (
                // --- RESPONSIVE UPDATE: Flex col mobile, Grid desktop ---
                <div className="flex flex-col lg:grid lg:grid-cols-3 lg:px-16 relative gap-6">
                    
                    {/* Danh sách sản phẩm */}
                    <div className="lg:col-span-2 px-2 lg:px-5 bg-white">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4 border-b pb-2 mb-2">
                                <Checkbox
                                    checked={selectedItems.length === cart.length}
                                    onChange={handleSelectAll}
                                />
                                <span className="font-semibold">Chọn tất cả ({cart.length} sản phẩm)</span>
                            </div>
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-start space-x-2">
                                    <div className="shrink-0 pt-4">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <CartItem item={item} showButton={true} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng tiền - Sticky bottom trên mobile */}
                    <div className="px-4 py-4 lg:px-5 fixed bottom-0 left-0 right-0 lg:static lg:h-[100vh] bg-white border-t lg:border-t-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none z-20">
                        <div className="border p-4 bg-white lg:shadow-lg rounded-md">
                            <div className="space-y-2 font-semibold text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span>Đã chọn:</span>
                                    <span>{totalQuantity} sản phẩm</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Tổng tiền:</span>
                                    <span className="font-bold text-lg sm:text-xl text-red-600">
                                        {totalPrice.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                variant="contained"
                                type="submit"
                                sx={{ padding: ".8rem 2rem", marginTop: "1rem", width: "100%", fontWeight: "bold" }}
                                disabled={selectedItems.length === 0}
                            >
                                Mua Hàng ({totalItem})
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full justify-center py-20 text-gray-500">Giỏ hàng của bạn đang trống</div>
            )}
        </div>
    );
};

export default Cart;