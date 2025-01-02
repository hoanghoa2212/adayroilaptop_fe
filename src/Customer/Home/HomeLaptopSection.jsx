import AliceCarousel from "react-alice-carousel";
import HomeLaptopCard from "./HomeLaptopCard";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import './index.css'

const HomeLaptopSection = ({ section, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  // --- RESPONSIVE UPDATE: Số lượng item hiển thị ---
  const responsive = {
    0: { items: 1.5, itemsFit: "contain" },   // Mobile: Hiện 1.5 cái để người dùng biết có thể lướt
    568: { items: 2.5, itemsFit: "contain" }, // Tablet nhỏ
    768: { items: 3.5, itemsFit: "contain" }, // Tablet lớn (iPad)
    1024: { items: 5, itemsFit: "contain" },  // Desktop
  };

  const items = data?.slice(0, 10).map((item) => (
    <div key={item.id} className="p-2"> {/* Giảm padding một chút */}
      <HomeLaptopCard laptop={item} />
    </div>
  ));

  const hasData = data && data.length > 0;
  // Sửa logic nút next dựa trên responsive hiện tại (đơn giản hóa bằng cách check items.length)
  const canSlideNext = hasData && activeIndex < items.length - 1; 
  const canSlidePrev = hasData && activeIndex > 0;

  return (
    <div className="relative px-2 sm:px-6 lg:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 py-5">{section}</h2>
      {!hasData ? (
        <p className="text-center text-gray-500 py-10">Chưa có dữ liệu</p>
      ) : (
        <div className="relative border p-2 md:p-5 rounded-lg shadow-sm">
          <AliceCarousel
            disableButtonsControls
            disableDotsControls
            mouseTracking
            items={items}
            activeIndex={activeIndex}
            responsive={responsive}
            onSlideChanged={syncActiveIndex}
            animationType="fadeout"
            animationDuration={2000}
          />
          {canSlideNext && (
            <Button
              onClick={slideNext}
              variant="contained"
              className="z-50"
              sx={{
                position: "absolute",
                top: "40%", // Căn giữa theo chiều dọc
                right: "0rem",
                minWidth: "auto", 
                padding: "8px",
                borderRadius: "50%",
                transform: "translate(50%, -50%) rotate(90deg)",
              }}
              aria-label="next"
            >
              <ArrowForwardIosIcon sx={{ transform: "rotate(-90deg)", fontSize: '1rem' }} />
            </Button>
          )}
          {canSlidePrev && (
            <Button
              onClick={slidePrev}
              variant="contained"
              className="z-50"
              sx={{
                position: "absolute",
                top: "40%",
                left: "0rem",
                minWidth: "auto",
                padding: "8px",
                borderRadius: "50%",
                transform: "translate(-50%, -50%) rotate(90deg)",
              }}
              aria-label="previous"
            >
              <ArrowForwardIosIcon sx={{ transform: "rotate(90deg)", fontSize: '1rem' }} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeLaptopSection;