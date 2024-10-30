import React,{useState} from 'react';
import {Link} from 'react-router-dom';

//Components 
import PageTitle from './../layouts/PageTitle';

function Login(){
    const [forgotPass, setForgotPass] = useState();
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Trang chủ" childPage="Đăng nhập" />               
                <section className="content-inner shop-account">                    
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content">
                                        <h4>KHÁCH HÀNG MỚI</h4>
                                        <p>Tạo tài khoản với chúng tôi để tận hưởng quy trình thanh toán nhanh chóng, lưu trữ nhiều địa chỉ giao hàng, xem và theo dõi đơn hàng trong tài khoản, cùng nhiều tiện ích khác.</p>
                                        <Link to={"/shop-registration"} className="btn btn-primary btnhover m-r5 button-lg radius-no">Tạo tài khoản</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content nav">
                                        <form onSubmit={(e) => e.preventDefault()} className={` col-12 ${forgotPass ? 'd-none' : ''}`}>
                                            <h4 className="text-secondary">Đăng nhập</h4>
                                            <p className="font-weight-600">Vui lòng đăng nhập nếu đã có tài khoản</p>
                                            <div className="mb-4">
                                                <label className="label-title">Địa chỉ Email *</label>
                                                <input name="dzName" required="" className="form-control" placeholder="Nhập Email" type="email" />
                                            </div>
                                            <div className="mb-4">
                                                <label className="label-title">Mật khẩu *</label>
                                                <input name="dzName" required="" className="form-control " placeholder="Nhập mật khẩu" type="password" />
                                            </div>
                                            <div className="text-left">
                                                <button type="submit" className="btn btn-primary btnhover me-2">Đăng nhập</button>
                                                <Link tp={"#"}  className="m-l5"
                                                    onClick={()=>setForgotPass(!forgotPass)}
                                                >
                                                    <i className="fas fa-unlock-alt"></i> Quên mật khẩu
                                                </Link> 
                                            </div>
                                        </form>
                                        <form  onSubmit={(e) => e.preventDefault()} className={`  col-12 ${forgotPass ? '' : 'd-none'}`} >
                                            <h4 className="text-secondary">FORGET PASSWORD ?</h4>
                                            <p className="font-weight-600">We will send you an email to reset your password. </p>
                                            <div className="mb-3">
                                                <label className="label-title">E-MAIL *</label>
                                                <input name="dzName" required="" className="form-control" placeholder="Your Email Id" type="email" />
                                            </div>
                                            <div className="text-left"> 
                                                <Link to={"#"} className="btn btn-outline-secondary btnhover m-r10 active"
                                                    onClick={()=>setForgotPass(!forgotPass)}
                                                >Back</Link>
                                                <button type="submit" className="btn btn-primary btnhover">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </section>
            </div>
        </>
    )
}
export default Login;