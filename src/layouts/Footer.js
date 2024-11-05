import React,{useState} from 'react';
import {Link} from 'react-router-dom';
// import Collapse from 'react-bootstrap/Collapse';
//images


// function heartToggle(){
//  	var  heartBlaste = document.querySelector('.heart');
//  	if(heartBlaste){
// 		heartBlaste.classList.toggle("heart-blast");			
//  	}	
// }

// const accordList = [
// 	{name:'Architecture'},{name:'Art'},{name:'Action'},{name:'Biography'},
// 	{name:'Body, Mind & Spirit'},{name:'Business & Economics'},
// 	{name:'Children Fiction'},{name:'Children Non-Fiction'},
// 	{name:'Comics & Graphics'},{name:'Cooking'},
// 	{name:'Crafts & Hobbies'},{name:'Design'},
// 	{name:'Drama'},{name:'Education'},
// 	{name:'Family & Relationships'},{name:'Fiction'},
// 	{name:'Foreign Language'},{name:'Games'},
// 	{name:'Gardening'},{name:'Health & Fitness'},
// 	{name:'History'},{name:'House & Home'},
// 	{name:'Humor'},{name:'Literary Collections'},
// 	{name:'Mathematics'},{name:'Medical'},
// 	{name:'Nature'},{name:'Performing Arts'},
// 	{name:'Pets'},{name:'Show others'}
// ];

function Footer({footerChange, logoImage}){
	//const [open, setOpen] = useState(false);
	// const  d = new Date();
	// const [accordBtn, setAccordBtn] = useState();
	return(
		<>
			<footer className={`site-footer ${footerChange}`}>				
				{/* <div className="footer-category">
					<div className="container">
						<div className="category-toggle">
							<Link to={"#"} className={`toggle-btn ${accordBtn ? 'active' : ''}`}
								onClick={() => setAccordBtn(!accordBtn)}
							>Books categories</Link>
							<div className="toggle-items row">
								<Collapse in={accordBtn} className="footer-col-book">
									<ul>
										{accordList.map((data, ind)=>(
											<li key={ind}><Link to={"/books-grid-view"}>{data.name}</Link></li>
										))}
									</ul>
								</Collapse>
							</div>
						</div>
					</div>
				</div>				 */}
				<div className="footer-top">
					<div className="container">
						<div className="row">
							<div className="col-xl-3 col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
								<div className="widget widget_about">
									<div className="footer-logo logo-white">
										<Link to={"/"}><img src={logoImage} alt="" /></Link> 
										{/* <p className="text">Hãy đến với Bookstore để khám phá kho tàng tri thức!</p> */}
									</div>
									
									<div className="dz-social-icon style-1">
										<ul>
											<li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
											<li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a></li>
											<li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a></li>
											<li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.2s">
								<div className="widget widget_services">
									<h5 className="footer-title">Dịch vụ</h5>
									<ul>
										<li><Link to={"/about-us"}>Về chúng tôi</Link></li>
										<li><Link to={"/contact-us"}>Liên hệ</Link></li>
										<li><Link to={"/privacy-policy"}>Chính sách bảo mật</Link></li>
										<li><Link to={"/pricing"}>Bảng giá</Link></li>
										<li><Link to={"/faq"}>FAQ</Link></li>
									</ul>
								</div>
							</div>

						
							{/* <div className="col-xl-2 col-lg-3 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.3s">
								<div className="widget widget_services">
									<h5 className="footer-title">Bookland ?</h5>
									<ul>
										<li><Link to={"/"}>Bookland</Link></li>
										<li><Link to={"/services"}>Services</Link></li>
										<li><Link to={"/books-detail"}>Book Details</Link></li>
										<li><Link to={"/blog-detail"}>Blog Details</Link></li>
										<li><Link to={"/books-grid-view"}>Shop</Link></li>
									</ul>   
								</div>
							</div> */}
							{/* <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.4s">
								<div className="widget widget_services">
									<h5 className="footer-title">Resources</h5>
									<ul>
										<li><Link to={"/services"}>Download</Link></li>
										<li><Link to={"/help-desk"}>Help Center</Link></li>
										<li><Link to={"/shop-cart"}>Shop Cart</Link></li>
										<li><Link to={"/shop-login"}>Login</Link></li>
										<li><Link to={"/about-us"}>Partner</Link></li>
									</ul>
								</div>
							</div> */}
							<div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 wow fadeInUp" data-wow-delay="0.5s">
								<div className="widget widget_getintuch">
									<h5 className="footer-title">Liên hệ với chúng tôi</h5>
									<ul>
										<li>
											<i className="flaticon-placeholder"></i>
											<span>60-62 Lê Lợi, Q.1, TP. HCM</span>
										</li>
										<li>
											<i className="flaticon-phone"></i>
											<span>1900636467</span>
										</li>
										<li>
											<i className="flaticon-email"></i> 
											<span>support@bookstore.com.vn<br/>
											info@bookstore.com.vn</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="col-xl-2 col-lg-3 col-sm-4 col-4 wow fadeInUp" data-wow-delay="0.3s">
								<div className="widget widget_services">
									<h5 className="footer-title">Tài khoản </h5>
									<ul>
										<li><Link to={"/login"}>Đăng nhập/Tạo mới</Link></li>
										<li><Link to={"/change-address"}>Thay đổi địa chỉ</Link></li>
										<li><Link to={"/account-details"}>Chi tiết tài khoản</Link></li>
										<li><Link to={"/order-history"}>Lịch sử mua hàng</Link></li>
									</ul>   
								</div>
							</div>		

						</div>
					</div>
				</div>
				{/* <div className="footer-bottom">
					<div className="container">
						<div className="row fb-inner">
							<div className="col-lg-6 col-md-12 text-start"> 
								<p className="copyright-text">Bookland Book Store Ecommerce Website - © {d.getFullYear()} All Rights Reserved</p>
							</div>
							<div className="col-lg-6 col-md-12 text-end"> 
								<p>Made with <span className="heart"
									onClick={heartToggle}
								></span> by 
								<a href="https://dexignzone.com/" target="_blank"> DexignZone</a></p>
							</div>
						</div>
					</div>
				</div> */}
			</footer>			
		</>
	)
}
export default Footer;