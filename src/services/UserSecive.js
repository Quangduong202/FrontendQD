import axios from "axios";

const API_URL = "https://voquangduong-2122110372-c-1-hsnq.onrender.com/User";

/**
 * Đăng ký tài khoản mới
 */
export const registerUser = async (data) => {
  return await axios.post(`${API_URL}/register`, data);
};

/**
 * Đăng nhập
 */
export const loginUser = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUser = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Xóa người dùng
 */
export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

/**
 * Lấy tất cả người dùng (có thể phân trang/tìm kiếm)
 */
export const getAllUsers = async (params = {}) => {
  return await axios.get(API_URL, { params });
};
