import axios from "axios";

const API_URL = "http://localhost:3000/api/banners";

/* ===================== GET ===================== */

/**
 * Lấy tất cả banner
 */
export const getAllBanners = async () => {
  return await axios.get(API_URL);
};

/**
 * Lấy banner theo ID
 */
export const getBannerById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Tìm kiếm + phân trang banner
 */
export const searchBanners = async (search = "", page = 1) => {
  return await axios.get(API_URL, {
    params: {
      search,
      page
    }
  });
};

/* ===================== POST ===================== */

/**
 * Thêm banner (không có ảnh)
 */
export const createBanner = async (data) => {
  return await axios.post(API_URL, data);
};

/**
 * Thêm banner có ảnh (FormData)
 */
export const createBannerWithImage = async (formData) => {
  return await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/* ===================== PUT ===================== */

/**
 * Cập nhật banner
 */
export const updateBanner = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Cập nhật banner + ảnh
 */
export const updateBannerWithImage = async (id, formData) => {
  return await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/* ===================== DELETE ===================== */

/**
 * Xoá banner
 */
export const deleteBanner = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
