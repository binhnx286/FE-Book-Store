import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components 
import PageTitle from './../layouts/PageTitle';

function Registration() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); 

    // Hàm xử lý đăng ký
    const handleRegistration = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp hay không
        if (password !== confirmPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp', {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/user/accounts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    password: password,
                    phone: phone,
                    email: email,
                    status: true,
                    role: 2
                })
            });

            if (!response.ok) {
                throw new Error('Tạo tài khoản không thành công. Vui lòng thử lại.');
            }

            const data = await response.json();

            // Hiển thị thông báo thành công
            toast.success(<>
                Đăng nhập thành công!<br />
                Bạn sẽ được chuyển sang trang đăng nhập sau 5 giây...
                </>, {
                position: "top-right",
                autoClose: 5000
            });

            setTimeout(() => {
                navigate('/login'); // Chuyển đến trang chủ
            }, 5500);

            console.log('Tạo tài khoản thành công:', data);
        } catch (err) {
            // Hiển thị thông báo lỗi
            toast.error(err.message, {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    return (
        <>
            <div className="page-content">
                <PageTitle parentPage="Trang chủ" childPage="Tạo tài khoản" />
                <section className="content-inner shop-account">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <form onSubmit={handleRegistration}>
                                        <h4 className="text-secondary">Tạo tài khoản</h4>
                                        <p className="font-weight-600">Nếu bạn chưa có tài khoản, hãy đăng ký ngay để trải nghiệm những tiện ích tuyệt vời cùng chúng tôi.</p>
                                        <div className="mb-4">
                                            <label className="label-title">Họ và tên *</label>
                                            <input
                                                name="name"
                                                required
                                                className="form-control"
                                                placeholder="Nhập họ và tên"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Số điện thoại *</label>
                                            <input
                                                name="phone"
                                                required
                                                className="form-control"
                                                placeholder="Nhập số điện thoại"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Địa chỉ email *</label>
                                            <input
                                                name="email"
                                                required
                                                className="form-control"
                                                placeholder="Nhập Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Mật khẩu *</label>
                                            <input
                                                name="password"
                                                required
                                                className="form-control"
                                                placeholder="Nhập mật khẩu"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Xác nhận mật khẩu *</label>
                                            <input
                                                name="confirmPassword"
                                                required
                                                className="form-control"
                                                placeholder="Nhập lại mật khẩu"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <small>Dữ liệu cá nhân của bạn sẽ được sử dụng để cải thiện trải nghiệm của bạn trên trang web này, quản lý quyền truy cập vào tài khoản của bạn và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.<br /><Link to={"/privacy-policy"}>Chính sách bảo mật</Link>.</small>
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
            <ToastContainer />
        </>
    )
}

export default Registration;
