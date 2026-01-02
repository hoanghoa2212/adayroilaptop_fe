import React, {useState, useEffect} from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {useNavigate} from "react-router-dom";
import api, {API_BASE_URL} from "../../Config/api";
import axios from "axios";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
    const navigate = useNavigate();
    const [carouselData, setCarouselData] = useState([]);

    useEffect(() => {
        const fetchCarouselImages = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/home/slideimage`);
                const imagePaths = response.data.map((url) => ({
                    image: `${API_BASE_URL}${url}`,
                    path: "/*",
                }));
                setCarouselData(imagePaths);
            } catch (error) {
                console.error("Failed to fetch carousel images:", error);
            }
        };
        fetchCarouselImages();
    }, []);
    console.log(carouselData);

    const items = carouselData.map((item, index) => (
        <img
            key={index}
            className="w-full h-[15rem] sm:h-[20rem] md:h-[26rem] lg:h-[34rem] object-cover cursor-pointer rounded-md -z-10"

            src={item.image}
            alt={`Slide ${index + 1}`}
            onDragStart={handleDragStart}
            role="presentation"
        />
    ));

    return (
        <AliceCarousel
            mouseTracking
            items={items}
            autoPlay
            infinite
            autoPlayInterval={2000}
            disableButtonsControls
        />
    );
};

export default HomeCarousel;

