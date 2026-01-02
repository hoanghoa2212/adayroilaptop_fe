import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api, {API_BASE_URL} from "../Config/api";
import axios from "axios";
import HomeCarousel from "../Customer/Carousel/HomeCarousel";
import HomeLaptopSection from "../Customer/Home/HomeLaptopSection";
import Laptop from "../Customer/Laptop/Laptop/Laptop";
import Banner from "../Customer/Banner/Banner";
import HomeBlogSection from "../Customer/Home/HomeBlogSection";

const Homepage = () => {
    const [hotDeals, setHotDeals] = useState([]);

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/laptops/hotdeals`);
                const deals = response.data
                .filter(item => item.status !== 0)
                .map(item => ({
                    id: item.id,
                    model: item.model,
                    originalPrice: item.price,
                    discountPercent: item.discountPercent > 0 ? item.discountPercent : null,
                    discountedPrice: item.price - (item.price * item.discountPercent) / 100,
                    imageUrl: item.imageUrls && item.imageUrls.length > 0
                        ? `${API_BASE_URL}${item.imageUrls[0]}`
                        : "/images/default.jpg"
                }));
                setHotDeals(deals);
            } catch (error) {
                console.error("Failed to fetch hot deals:", error);
            }
        };
        fetchHotDeals();

        localStorage.removeItem('bannerClosed');
    }, []);

    return (
        <div className="">
            <HomeCarousel />

            <div className="space-y-10 py-20">
                <HomeLaptopSection data={hotDeals} section={"Ưu đãi hấp dẫn"} />
            </div>

            <Laptop />

            {}
            <HomeBlogSection />

        </div>
    );
};

export default Homepage;