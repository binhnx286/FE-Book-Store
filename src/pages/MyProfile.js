import React from 'react';
import {Link} from 'react-router-dom';

import profile from './../assets/images/profile3.jpg';

const proiflePages = [
    {to:'/shop-cart', icons:'flaticon-shopping-cart-1', name:'Giỏ hàng của tôi'},
    {to:'/wishlist', icons:'far fa-heart', name:'Danh sách yêu thích'},
    {to:'/books-grid-view', icons:'fa fa-briefcase', name:'Cửa hàng'},
    {to:'/services', icons:'far fa-bell', name:'Dịch vụ'},
    {to:'/help-desk', icons:'far fa-id-card', name:'Bảng trợ giúp'},
    {to:'/privacy-policy', icons:'fa fa-key', name:'Chính sách bảo mật'},
    {to:'/shop-login', icons:'fas fa-sign-out-alt', name:'Đăng xuất'},
    
];

const inputBlock = [
    {labelName:'Tên của bạn', placeHoldName:'Alexander Weir', },
    {labelName:'Chức danh nghề nghiệp', placeHoldName:'Nhà thiết kế web', },
    {labelName:'Ngôn ngữ', placeHoldName:'Ngôn ngữ', },
    {labelName:'Tuổi', placeHoldName:'Tuổi', },

];
const inputBlockContact = [
    {labelName:'Số điện thoại liên hệ', placeHoldName:'+1 123 456 7890', },
    {labelName:'Địa chỉ email', placeHoldName:'info@example.com', },
    {labelName:'Quốc gia', placeHoldName:'Tên quốc gia', },
    {labelName:'Mã bưu điện', placeHoldName:'112233', },
    {labelName:'Thành phố', placeHoldName:'Tên thành phố', },
    {labelName:'Địa chỉ đầy đủ', placeHoldName:'Thành phố New York', },
    
];

function MyProfile(){
    return(
        <>
             <div className="page-content bg-white">
                <div className="content-block">
                    <section className="content-inner bg-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 m-b30">
                                    <div className="sticky-top">
                                        <div className="shop-account">
                                            <div className="account-detail text-center">
                                                <div className="my-image">
                                                    <Link to={"#"}>
                                                        <img alt="profile" src={profile} />
                                                    </Link>
                                                </div>
                                                <div className="account-title">
                                                    <div className="">
                                                        <h4 className="m-b5"><Link to={"#"}>David Matin</Link></h4>
                                                        <p className="m-b0"><Link to={"#"}>Web developer</Link></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="account-list">
                                                <li>
                                                    <Link to={"/my-profile"} className="active"><i className="far fa-user" aria-hidden="true"></i> 
                                                    <span>Profile</span></Link>
                                                </li>
                                                {proiflePages.map((item, ind)=>(
                                                    <li key={ind}>
                                                        <Link to={item.to}><i className={item.icons}></i>
                                                            <span>{item.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-8 m-b30">
                                    <div className="shop-bx shop-profile">
                                        <div className="shop-bx-title clearfix">
                                            <h5 className="text-uppercase">Thông tin cơ bản</h5>
                                        </div>
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            <div className="row m-b30">
                                                {inputBlock.map((data, ind)=>(
                                                    <div className="col-lg-6 col-md-6" key={ind}>
                                                        <div className="mb-3">
                                                            <label htmlFor={`formcontrolinput${ind+1}`} className="form-label">{data.labelName} :</label>
                                                            <input type="text" className="form-control" id={`formcontrolinput${ind+1}`} placeholder={data.placeHoldName} />
                                                        </div>
                                                    </div>
                                                ))}   
                                                <div className="col-lg-12 col-md-12">                                                    
                                                    <div className="mb-3">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Mô tả:</label>
                                                        <textarea className="form-control"  id="exampleFormControlTextarea" rows="5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s.</textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="shop-bx-title clearfix">
                                                <h5 className="text-uppercase">Thông tin liên hệ</h5>
                                            </div>
                                            <div className="row">
                                                {inputBlockContact.map((data, ind)=>(
                                                    <div className="col-lg-6 col-md-6" key={ind}>
                                                        <div className="mb-3">
                                                            <label htmlFor={`formcontrolinput1${ind+5}`} className="form-label">{data.labelName} :</label>
                                                            <input type="text" className="form-control" id={`formcontrolinput1${ind+5}`} placeholder={data.placeHoldName} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="btn btn-primary btnhover mt-2">Save Setting</button>
                                        </form>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
             </div>
        </>
    )
}
export default MyProfile;