import React from "react";
import "../../pages/productlists/productlist.css";

function NewsCard({ news }) {
  return (
    <div className="col-lg-3 col-md-6 col-12">
      <div className="single-product">
        <div className="product-image">
          <img
            src={
              news.image
                ? `http://localhost:3000/api/images/${news.image}`
                : "/placeholder.png"
            }
            alt={news.title || "Tin tức"}
          />
          <div className="button">
            <a className="btn" href={`/news/${news.id}`}>
              <i className="lni lni-eye"></i> Xem chi tiết
            </a>
          </div>
        </div>

        <div className="product-info">
          <span className="category">{news.category || "Tin tức"}</span>
          <h4 className="title">
            <a href={`/news/${news.id}`}>{news.title || "Tiêu đề"}</a>
          </h4>
          <p className="description">
            {news.summary || "Không có mô tả ngắn"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
