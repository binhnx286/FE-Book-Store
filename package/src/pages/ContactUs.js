import React, {useRef} from 'react';
import emailjs from '@emailjs/browser';
import swal from "sweetalert2";	

import PageTitle from './../layouts/PageTitle';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

import bg2 from './../assets/images/background/bg2.jpg';

const ContactUs = () =>{
    const form = useRef();
	const sendEmail = (e) => {
		e.preventDefault();
		//emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_USER_ID')
		emailjs.sendForm('service_gfykn6i', 'template_iy1pb0b', e.target, 'HccoOtZS6GHw-N-m6')
		  .then((result) => {
			  console.log(result.text);
		  }, (error) => {
			  console.log(error.text);
		  });
		  e.target.reset()
		  swal('Good job!', 'form successfuly submmited', "success");
	};
    return(
        <>
            <div className="page-content">
                <PageTitle parentPage="Trang chủ" childPage="Liên hệ" />    
                <div className="content-inner-2 pt-0">
                    <div className="map-iframe">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.55801461011!2d106.77754397480587!3d10.845096789307872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175270ddaa8cca1%3A0x496d0614ef91b494!2zTmjDoCBTw6FjaCBGQUhBU0EgUXXhuq1uIDk!5e0!3m2!1svi!2s!4v1730278659456!5m2!1svi!2s" style={{border:'0', width:'100%', minHeight:'100%', marginBottom: '-8px'}} allowFullScreen></iframe>
                    </div>
                </div>
                <section className="contact-wraper1" style={{backgroundImage: 'url('+ bg2 +')'}}>	
                    <div className="container" >
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="contact-info">
                                    <div className="section-head text-white style-1">
                                        <h3 className="title text-white">Liên Hệ Với Chúng Tôi</h3>
                                        <p>Nếu bạn quan tâm đến việc hợp tác với chúng tôi, xin hãy liên hệ.</p>
                                    </div>
                                    <ul className="no-margin">
                                        <li className="icon-bx-wraper text-white left m-b30">
                                            <div className="icon-md">
                                                <span className="icon-cell text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                </span>
                                            </div>
                                            <div className="icon-content">
                                                <h5 className=" dz-tilte text-white">Địa chỉ của chúng tôi</h5>
                                                <p>60-62 Lê Lợi, Q.1, TP. HCM</p>
                                            </div>
                                        </li>
                                        <li className="icon-bx-wraper text-white left m-b30">
                                            <div className="icon-md">
                                                <span className="icon-cell text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                </span>
                                            </div>
                                            <div className="icon-content">
                                                <h5 className="dz-tilte text-white">Email của chúng tôi</h5>
                                                <p>support@bookstore.com.vn<br/>
                                                info@bookstore.com.vn</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-7 m-b40">
                                <div className="contact-area1 m-r20 m-md-r0">
                                    <div className="section-head style-1">
                                        <h6 className="sub-title text-primary">LIÊN HỆ CHÚNG TÔI</h6>
                                        <h3 className="title m-b20">Hãy Kết Nối Với Chúng Tôi</h3>
                                    </div>
                                    <form className="dz-form dzForm" ref={form} onSubmit={sendEmail}>
                                        <input type="hidden" className="form-control" name="dzToDo" defaultValue="Contact" />
                                        <div className="dzFormMsg"></div>		
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzName" placeholder="Họ và Tên" />
                                        </div>
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzEmail" placeholder="Địa Chỉ Email" />
                                        </div>
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzPhoneNumber" placeholder="Số Điện Thoại" />
                                        </div>
                                        <div className="input-group">
                                            <textarea required name="dzMessage" rows="5" className="form-control" placeholder="Hãy cho chúng tôi biết bạn cần gì?"></textarea>
                                        </div>
                                        <div>
                                            <button name="submit" type="submit" value="submit" className="btn w-100 btn-primary btnhover">Gửi</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />      
                        </div>   
                    </div>
                </section>  
                <NewsLetter />
            </div>
        </>
    )
}
export default ContactUs;