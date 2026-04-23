// services/categoryService.js
import axios from "axios";

const API_URL = "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category";

/**
 * Lấy tất cả danh mục
 */
export const getAllCategories = async () => {
  return await axios.get(API_URL);
};

/**
 * Lấy danh mục theo ID
 */
export const getCategoryById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Thêm danh mục mới
 */
export const createCategory = async (data) => {
  return await axios.post(API_URL, data);
};

/**
 * Cập nhật danh mục
 */
export const updateCategory = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Xoá danh mục
 */
export const deleteCategory = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

/**
 * Tìm kiếm + phân trang danh mục
 * @param {string} search
 * @param {number} page
 */
export const searchCategories = async (search = "", page = 1) => {
  return await axios.get(API_URL, {
    params: {
      search,
      page
    }
  });
};
