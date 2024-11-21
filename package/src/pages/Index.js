import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import ScrollToTop2 from "react-scroll-to-top";

//layouts
import Header from "./../layouts/Header";
import Footer from "./../layouts/Footer";
import ScrollToTop from "./../layouts/ScrollToTop";

//Pages
import Home from "./Home";
import AboutUs from "./AboutUs";
import MyProfile from "./MyProfile";
import Search from "./Search";
import Categories from "./Categories";
import ShopCart from "./ShopCart";
import Login from "./Login";
import Registration from "./Registration";
import ShopCheckout from "./ShopCheckout";
import ShopDetail from "./ShopDetail";
import ContactUs from "./ContactUs";
import PromotionsPage from "./Promotion";
import ErrorPage from "./ErrorPage";
import PromotionDetail from "./PromotionDetail";

//images
import logo from "./../assets/images/logo.png";
import SearchModel from "../models/SearchModel";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" exact element={<Home />} />
          <Route path="/about-us" exact element={<AboutUs />} />
          <Route path="/my-profile" exact element={<MyProfile />} />
          <Route path="/search" exact element={<Search />} />
          <Route path="/categories" exact element={<Categories />} />
          <Route path="/promotion" exact element={<PromotionsPage />} />
          <Route path="/promotion-details/:id" element={<PromotionDetail />} />
          <Route path="/cart" exact element={<ShopCart />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Registration />} />
          <Route path="/shop-checkout" exact element={<ShopCheckout />} />
          <Route path="/books-detail" exact element={<ShopDetail />} />
          <Route path="/contact-us" exact element={<ContactUs />} />
        </Route>
      </Routes>
      <ScrollToTop />
      <ScrollToTop2
        className="styles_scroll-to-top__2A70v  fas fa-arrow-up scroltop"
        smooth
      />
    </BrowserRouter>
  );
}

function MainLayout() {
  const [searchParams, setSearchParams] = useState(new SearchModel());

  const handleSearch = (params) => {
    const newSearchParams = SearchModel.fromObject({
      ...searchParams,
      ...params,
    });
    setSearchParams(newSearchParams);
  };

  return (
    <div className="page-wraper">
      <Header onSearch={handleSearch} />
      <Outlet context={{ searchParams }} />
      <Footer footerChange="style-1" logoImage={logo} />
    </div>
  );
}
export default Index;
