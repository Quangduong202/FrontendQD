import axios from "axios";

const API_URL = "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Productt";

/**
 * Lấy tất cả sản phẩm
 */
export const getAllProducts = async () => {
  return await axios.get(API_URL);
};

/**
 * Lấy sản phẩm theo ID
 */
export const getProductById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Thêm sản phẩm mới
 */
export const createProduct = async (data) => {
  return await axios.post(API_URL, data);
};

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Xoá sản phẩm
 */
export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

/**
 * Tìm kiếm + phân trang
 * @param {string} search
 * @param {number} page
 */
export const searchProducts = async (search = "", page = 1) => {
  return await axios.get(API_URL, {
    params: {
      search,
      page
    }
  });
};
