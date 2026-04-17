import axios from "axios";

const API_URL = "http://localhost:3000/api/news";

/**
 * Lấy tất cả tin tức
 */
export const getAllNews = async () => {
  return await axios.get(API_URL);
};

/**
 * Lấy tin tức theo ID
 */
export const getNewsById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * Thêm tin tức mới
 */
export const createNews = async (data) => {
  return await axios.post(API_URL, data);
};

/**
 * Cập nhật tin tức
 */
export const updateNews = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/**
 * Xoá tin tức
 */
export const deleteNews = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

/**
 * Tìm kiếm + phân trang tin tức
 * @param {string} search
 * @param {number} page
 */
export const searchNews = async (search = "", page = 1) => {
  return await axios.get(API_URL, {
    params: {
      search,
      page
    }
  });
};
