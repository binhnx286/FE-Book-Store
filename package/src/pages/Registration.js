import React from 'react';
import {Link} from 'react-router-dom';

//Components 
import PageTitle from './../layouts/PageTitle';

function Registration(){
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Trang chủ" childPage="Tạo tài khoản" />               
                <section className="content-inner shop-account">
				
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <form onSubmit={(e) => e.preventDefault()}> 
                                        <h4 className="text-secondary">Tạo tài khoản</h4>
                                        <p className="font-weight-600">Nếu bạn chưa có tài khoản, hãy đăng ký ngay để trải nghiệm những tiện ích tuyệt vời cùng chúng tôi.</p>
                                        <div className="mb-4">
                                            <label className="label-title">Họ và tên *</label>
                                            <input name="dzName" required="" className="form-control" placeholder="Nhập họ và tên" type="text" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Số điện thoại *</label>
                                            <input name="dzName" required="" className="form-control" placeholder="Nhập số điện thoại" type="phone" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Địa chỉ email *</label>
                                            <input name="dzName" required="" className="form-control" placeholder="Nhập Email" type="email" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Mật khẩu *</label>
                                            <input name="dzName" required="" className="form-control " placeholder="Nhập mật khẩu" type="password" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Xác nhận mật khẩu *</label>
                                            <input name="dzName" required="" className="form-control" placeholder="Nhập lại mật khẩu" type="password" />
                                        </div>
                                        <div className="mb-5">
                                            <small>Dữ liệu cá nhân của bạn sẽ được sử dụng để cải thiện trải nghiệm của bạn trên trang web này, quản lý quyền truy cập vào tài khoản của bạn và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.<br/><Link to={"/privacy-policy"}>Chính sách bảo mật</Link>.</small>
                                        </div>
                                        <div className="text-left">
                                            <button type="submit" className="btn btn-primary btnhover w-100 me-2">Tạo</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        </>
    )
}
export default Registration;