import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import ScrollToTop2 from "react-scroll-to-top";

//layouts
import Header from "./../layouts/Header";
import Footer from "./../layouts/Footer";
import ScrollToTop from "./../layouts/ScrollToTop";

//Pages
import Home from "./Home";
import Home2 from "./Home2";
import AboutUs from "./AboutUs";
import MyProfile from "./MyProfile";
import Services from "./Services";
import Faq from "./Faq";
import HelpDesk from "./HelpDesk";
import Pricing from "./Pricing";
import PrivacyPolicy from "./PrivacyPolicy";
import BooksGridView from "./BooksGridView";
import ShopList from "./ShopList";
import Search from "./Search";
import Categories from "./Categories";
import BooksListViewSidebar from "./BooksListViewSidebar";
import ShopCart from "./ShopCart";
import Wishlist from "./Wishlist";
import Login from "./Login";
import Registration from "./Registration";
import ShopCheckout from "./ShopCheckout";
import ShopDetail from "./ShopDetail";
import BlogGrid from "./BlogGrid";
import BlogLargeSidebar from "./BlogLargeSidebar";
import BlogListSidebar from "./BlogListSidebar";
import BlogDetail from "./BlogDetail";
import ContactUs from "./ContactUs";

import ErrorPage from "./ErrorPage";
import UnderConstruction from "./UnderConstruction";
import ComingSoon from "./ComingSoon";

//images
import logo from "./../assets/images/logo.png";
import SearchModel from "../models/SearchModel";

function Index() {
  return (
    <BrowserRouter>
      {/* 
			<Route path="/index-2" exact>
				<Header />
					<Main>
						<Switch>
							<Route path='/index-2' exact component={Home2} />
						</Switch>
					</Main>
				<Footer  footerChange="footer-dark" logoImage={logoWhite} />		
			</Route> */}
      <Routes>
        <Route path="/error-404" element={<ErrorPage />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/index-2" element={<Home2 />} />
        <Route element={<MainLayout />}>
          <Route path="/" exact element={<Home />} />
          <Route path="/about-us" exact element={<AboutUs />} />
          <Route path="/my-profile" exact element={<MyProfile />} />
          <Route path="/services" exact element={<Services />} />
          <Route path="/faq" exact element={<Faq />} />
          <Route path="/help-desk" exact element={<HelpDesk />} />
          <Route path="/pricing" exact element={<Pricing />} />
          <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
          <Route path="/books-grid-view" exact element={<BooksGridView />} />
          <Route path="/books-list" exact element={<ShopList />} />
          <Route path="/search" exact element={<Search />} />
          <Route path="/categories" exact element={<Categories />} />
          <Route
            path="/books-list-view-sidebar"
            exact
            element={<BooksListViewSidebar />}
          />
          <Route path="/cart" exact element={<ShopCart />} />
          <Route path="/wishlist" exact element={<Wishlist />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Registration />} />
          <Route path="/shop-checkout" exact element={<ShopCheckout />} />
          <Route path="/books-detail" exact element={<ShopDetail />} />
          <Route path="/blog-grid" exact element={<BlogGrid />} />
          <Route
            path="/blog-large-sidebar"
            exact
            element={<BlogLargeSidebar />}
          />
          <Route
            path="/blog-list-sidebar"
            exact
            element={<BlogListSidebar />}
          />
          <Route path="/blog-detail" exact element={<BlogDetail />} />
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
