import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./banner.css";
import '../../assets/css/main.css';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/LineIcons.3.0.css';
import '../../assets/css/glightbox.min.css';
import '../../assets/css/tiny-slider.css';
function Banner() {
    const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000, // 4 giây đổi banner
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // tắt mũi tên nếu muốn
    pauseOnHover: false,
  };
  return (
     <section class="hero-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-12 custom-padding-right">
                    <div class="slider-head">
                        {/* <!-- Start Hero Slider --> */}
                        <Slider {...settings} className="hero-slider">
                            {/* <!-- Start Single Slider --> */}
                            <div class="single-slider">
                              <div class="slider-bg1">
                                <div class="content">
                                    <h2><span>No restocking fee ($35 savings)</span>
                                        M75 Sport Watch
                                    </h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut
                                        labore dolore magna aliqua.</p>
                                    <h3><span>Now Only</span> $320.99</h3>
                                    <div class="button">
                                        <a href="product-grids.html" class="btn">Shop Now</a>
                                    </div>
                                </div>
                                </div>
                            </div>
                            {/* <!-- End Single Slider --> */}
                            {/* <!-- Start Single Slider --> */}
                            <div class="single-slider">
                              <div class="slider-bg2">
                                <div class="content">
                                    <h2><span>Big Sale Offer</span>
                                        Get the Best Deal on CCTV Camera
                                    </h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut
                                        labore dolore magna aliqua.</p>
                                    <h3><span>Combo Only:</span> $590.00</h3>
                                    <div class="button">
                                        <a href="product-grids.html" class="btn">Shop Now</a>
                                    </div>
                                </div>
                                </div>
                            </div>
                            {/* <!-- End Single Slider --> */}
                        </Slider>
                        {/* <!-- End Hero Slider --> */}
                    </div>
                </div>
                <div class="col-lg-4 col-12">
                    <div class="row">
                        <div class="col-lg-12 col-md-6 col-12 md-custom-padding">
                            {/* <!-- Start Small Banner --> */}
                            <div class="hero-small-banner"
                             style={{
                 backgroundImage: "url('../images/hero/slider-bnr.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                               >
                                <div class="content">
                                    <h2>
                                        <span>New line required</span>
                                        iPhone 12 Pro Max
                                    </h2>
                                    <h3>$259.99</h3>
                                </div>
                            </div>
                            {/* <!-- End Small Banner --> */}
                        </div>
                        <div class="col-lg-12 col-md-6 col-12">
                            {/* <!-- Start Small Banner --> */}
                            <div class="hero-small-banner style2">
                                <div class="content">
                                    <h2>Weekly Sale!</h2>
                                    <p>Saving up to 50% off all online store items this week.</p>
                                    <div class="button">
                                        <a class="btn" href="product-grids.html">Shop Now</a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Start Small Banner --> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}
export default Banner;

