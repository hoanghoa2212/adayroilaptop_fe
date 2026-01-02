import React, { useState, useEffect } from 'react';
import './BannerManagement.css';
import api from '../../../Config/api';
import axios from 'axios';
import { API_BASE_URL } from '../../../Config/api';

const BannerManagement = () => {
  const [urls, setUrls] = useState([]);

  const getURLs = async () => {
    try {

        const res = await api.get("api/banner/slideimage");
        if (res.data) {
          setUrls(res.data);
        }
    } catch (error) {

        console.error("Failed to fetch banner images for admin view:", error);
    }
  };

  useEffect(()=>{
    getURLs();
  },[])

  const handleDeleteBanner = async (url) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá banner này?");
    if (!confirmDelete) return;
    const deleteUrl = url.replace("/images/homeslide/", "");
    try {
      // Endpoint DELETE mới: /api/admin/banner/{filename}
      await api.delete(`api/admin/banner/${deleteUrl}`, { // CHÚ Ý: Đã thay đổi đường dẫn thành admin
        withCredentials: true
      });
      alert('Xóa banner thành công!');
      await getURLs(); // reload danh sách
    } catch (error) {
      alert('Xóa banner thất bại');
      console.error("Delete error:", error);
    }
  };

  const handleAddBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

        const jwt = localStorage.getItem("jwt");
        await axios.post(`${API_BASE_URL}/api/admin/banner/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${jwt}`
            }
        });
        alert("Tải lên thành công!");
        await getURLs();
    } catch (error) {
        console.error("Lỗi khi tải lên banner:", error);
        alert(`Tải lên thất bại! Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
    <div className="grid grid-cols-2 gap-4">
      {urls.map((url, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => handleDeleteBanner(url)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
          >
            ×
          </button>
          <img
            src={`${API_BASE_URL}${url}`}
            className="w-full h-auto rounded-lg shadow"
            alt={`Image ${index}`}
          />
        </div>
      ))}
  </div>
  <div className="mt-4">
        <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer shadow">
          Thêm banner
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddBanner}
          />
        </label>
      </div>
    </>
  );
};

export default BannerManagement;