import React, { useEffect, useState } from "react";
import { getAllNews } from "../../services/NewsSevice"; // 👉 service gọi API /api/news
import { getAllCategories } from "../../services/CategorySevice"; // nếu muốn lọc theo danh mục

import { useSearchParams } from "react-router-dom";
import NewsCard from "../../components/news/newsCart"; // component hiển thị từng tin tức

function ListNews() {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");

  // 👉 state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // số tin tức mỗi trang

  useEffect(() => {
    loadNews();
    loadCategories();
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(",").map(Number));
    }
  }, [search, categoryParam]);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      const data = res.data.data || [];
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const loadNews = async () => {
    try {
      const res = await getAllNews({ search });
      const data = res.data.data || [];
      setAllNews(data);
      setFilteredNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredNews(allNews);
      return;
    }

    const results = allNews.filter((news) =>
      selectedCategories.includes(Number(news.category_id))
    );

    setFilteredNews(results);
    setCurrentPage(1); // reset về trang 1 khi lọc
  }, [selectedCategories, allNews]);

  // 👉 logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-content-area">
      {/* Sidebar lọc */}
      <div className="filter-panel sidebar-col">
        <h3>Bộ Lọc Tin Tức</h3>
        <div className="filter-group">
          <h4>Danh mục</h4>
          <div className="filter-options">
            {categories.map((category) => {
              const isChecked = selectedCategories.includes(category.id);
              return (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={isChecked}
                    onChange={() => handleFilterChange(category.id)}
                  />
                  {category.name}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hiển thị tin tức */}
      <div className="product-display-col">
        <h2 className="parent">Tin Tức ({filteredNews.length})</h2>

        <div className="row">
          {currentNews.length > 0 ? (
            currentNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))
          ) : (
            <div className="col-12">
              <p style={{ padding: "20px", textAlign: "center" }}>
                Không tìm thấy tin tức nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>

        {/* 👉 Phân trang */}
        {totalPages > 1 && (
          <div className="pagination mt-4 text-center">
            <ul className="pagination-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    className={`page-btn ${page === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListNews;
