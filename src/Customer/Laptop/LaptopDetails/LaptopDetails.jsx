import { useState, useRef, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import LaptopReviewCard from "./LaptopReviewCard";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  TextField,
  Rating,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { findLaptopById } from "../../../Redux/Admin/Laptop/Action";
import { addItemToCart, getCart } from "../../../Redux/Customers/Cart/Action";
import { getAllReviews } from "../../../Redux/Customers/Review/Action";
import api, { API_BASE_URL } from "../../../Config/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LaptopDetails() {
  // ... (Giữ nguyên logic hooks, state, effect từ dòng 30-143 của file gốc)
  const scrollRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { laptop } = useSelector((store) => store.laptop);
  const reviewStore = useSelector((store) => store.review);
  const { laptopId } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    const data = { laptopId: Number(laptopId), jwt };
    dispatch(findLaptopById(data));
    dispatch(getAllReviews(laptopId));
  }, [laptopId]);

  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (laptop?.laptopColors?.length > 0) {
      setSelectedColor(laptop.laptopColors[0]);
    }
  }, [laptop]);

  const handleSetActiveImage = (image) => {
    setActiveImage(image);
  };

  const handleQuantityChange = (num) => {
    setQuantity((prev) =>
      Math.min(Math.max(1, prev + num), selectedColor?.quantity ?? 200)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jwt != null) {
      try {
        const data = {
          laptopId: Number(laptopId),
          colorId: selectedColor.colorId,
          quantity,
        };
        await dispatch(addItemToCart({ data, jwt }));
        dispatch(getCart(jwt));
        setAlertSeverity("success");
        setAlertMessage("Thêm vào giỏ hàng thành công!");
        setOpenAlert(true);
      } catch (error) {
        console.log("error: ", error);
        setAlertSeverity("error");
        setAlertMessage("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
        setOpenAlert(true);
      }
    }
    else {
      setAlertSeverity("error");
      setAlertMessage("Bạn phải đăng nhập mới thực hiện được tính năng này");
      setOpenAlert(true);
    }
  };

  const [newReview, setNewReview] = useState({
    des: "",
    review: 0,
  });

  const handleSubmitReview = async () => {
    if (newReview.des.trim() === "") {
      setAlertSeverity("error");
      setAlertMessage("Bình luận không được để trống.");
      setOpenAlert(true);
      return;
    } else if (jwt) {
      try {
        const res = await api.post("/api/reviews/create", {
          laptopId: parseInt(laptopId),
          review: newReview.des,
        });

        await api.post("/api/ratings/create", {
          laptopId: parseInt(laptopId),
          rating: newReview.review,
        });

        if (res) {
          setNewReview({
            des: "",
            review: 0,
          });
          dispatch(getAllReviews(laptopId));
        }
      } catch (error) {
        alert(error?.response?.data?.message || "You haven't logged in yet");
        console.log("Error submitting review:", error);
      }
    } else if (!jwt) {
      setAlertSeverity("error");
      setAlertMessage("You must be logged in to submit a review.");
      setOpenAlert(true);
    }
  };

  if(!laptop) return <div className="text-center py-10">Đang tải dữ liệu...</div>

  return (
    // --- RESPONSIVE UPDATE: Padding nhỏ hơn trên mobile ---
    <div className="bg-white px-2 sm:px-6 lg:px-20 pb-10">
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <div className="pt-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
          {/* Cột Ảnh */}
          <div className="flex flex-col items-center">
            <div className="rounded-lg border border-gray-300 w-full h-[20rem] sm:h-[25rem] lg:h-[35rem] flex justify-center items-center overflow-hidden">
              <img
                src={activeImage || `${API_BASE_URL}${laptop?.imageUrls?.[0]}`}
                alt={laptop?.model}
                className="w-full h-full object-contain p-2"
              />
            </div>
            {/* Ảnh nhỏ */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {laptop?.imageUrls?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleSetActiveImage(`${API_BASE_URL}${image}`)}
                  className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
                >
                  <img
                    src={`${API_BASE_URL}${image}`}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột Thông tin */}
          <div>
            <div className="lg:col-span-1 mx-auto max-w-2xl px-2 pb-10 lg:pb-24">
              <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-4">
                {laptop?.brandName} {laptop?.model}
              </h1>
              
              <div className="flex flex-wrap items-end gap-3 text-gray-900 mt-2">
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {((laptop?.price * (100 - laptop?.discountPercent)) / 100).toLocaleString('vi-VN')} đ
                </p>
                <p className="opacity-50 line-through text-sm sm:text-base">
                  {laptop?.price.toLocaleString('vi-VN')} đ
                </p>
                <span className="text-green-600 font-semibold bg-green-100 px-2 rounded">
                  -{laptop?.discountPercent}%
                </span>
              </div>

              {/* Tags danh mục */}
              {laptop?.categories?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {laptop.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      #{category.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Form chọn màu & số lượng */}
              <form className="mt-8" onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Chọn màu sắc</h3>
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                    <div className="flex flex-wrap gap-3">
                      {laptop?.laptopColors.map((color) => (
                        <RadioGroup.Option
                          key={color.colorId}
                          value={color}
                          disabled={color.quantity < 1}
                          className={({ active, checked }) =>
                            classNames(
                              color.quantity > 0
                                ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-400",
                              active ? "ring-2 ring-indigo-500" : "",
                              checked ? "border-2 border-indigo-500" : "border border-gray-300",
                              "group relative flex items-center justify-center rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50 focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="span">{color?.colorName}</RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} size="small">
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <IconButton onClick={() => handleQuantityChange(1)} size="small">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </div>
                  <span className="text-sm text-gray-500">Kho: {selectedColor?.quantity}</span>
                </div>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{ 
                    mt: 4, 
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                    padding: ".8rem 3rem",
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Thông số kỹ thuật */}
        <section className="mt-8">
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông số kỹ thuật chi tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {laptop?.cpu && (
                    <div><span className="font-bold">CPU:</span> {laptop.cpu.model} ({laptop.cpu.core} nhân, {laptop.cpu.thread} luồng)</div>
                )}
                {laptop?.ramMemory && (
                    <div><span className="font-bold">RAM:</span> {laptop.ramMemory}GB ({laptop.ramDetail})</div>
                )}
                {laptop?.diskCapacity && (
                    <div><span className="font-bold">Ổ cứng:</span> {laptop.diskCapacity}GB {laptop.diskDetail}</div>
                )}
                {laptop?.gpus?.length > 0 && (
                    <div><span className="font-bold">VGA:</span> {laptop.gpus.map(g => g.model).join(', ')}</div>
                )}
                {laptop?.screenSize && (
                    <div><span className="font-bold">Màn hình:</span> {laptop.screenSize} inch, {laptop.screenDetail}</div>
                )}
                {laptop?.batteryCharger && (
                    <div><span className="font-bold">Pin:</span> {laptop.batteryCharger}</div>
                )}
                {laptop?.osVersion && (
                    <div><span className="font-bold">OS:</span> {laptop.osVersion}</div>
                )}
                {laptop?.design && (
                    <div><span className="font-bold">Thiết kế:</span> {laptop.design}</div>
                )}
            </div>
          </div>
        </section>

        {/* Bình luận */}
        <section className="mt-10">
          <h1 className="font-semibold text-lg pb-4">Đánh giá & Bình luận</h1>
          <div className="flex flex-col gap-3 mb-8 w-full max-w-2xl">
            <TextField
              value={newReview.des}
              onChange={(e) => setNewReview((pre) => ({ ...pre, des: e.target.value }))}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              multiline
              rows={3}
              fullWidth
            />
            <div className="flex justify-between items-center">
                <Rating
                  name="user-rating"
                  value={newReview.review}
                  onChange={(event, v) => setNewReview((pre) => ({ ...pre, review: v }))}
                />
                <Button variant="contained" onClick={handleSubmitReview} size="small">Gửi đánh giá</Button>
            </div>
          </div>

          <div className="space-y-4">
            {reviewStore?.reviews && reviewStore.reviews.length > 0 ? (
                reviewStore.reviews.map((item, i) => (
                    <LaptopReviewCard key={i} item={item} />
                ))
            ) : (
                <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}