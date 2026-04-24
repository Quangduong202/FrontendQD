// services/brandService.js
import axios from "axios";

const API_URL = "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Brand";

/**
 * Lấy tất cả thương hiệu
 */
export const getAllBrands = async () => {
  return await axios.get(API_URL);
};

/**
 * Lấy thương hiệu theo ID
 */
export const getBrandById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Thêm thương hiệu mới
 */
export const createBrand = async (data) => {
  return await axios.post(API_URL, data);
};

/**
 * Cập nhật thương hiệu
 */
export const updateBrand = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Xoá thương hiệu
 */
export const deleteBrand = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

/**
 * Tìm kiếm + phân trang thương hiệu
 * @param {string} search
 * @param {number} page
 */
export const searchBrands = async (search = "", page = 1) => {
  return await axios.get(API_URL, {
    params: {
      search,
      page
    }
  });
};
