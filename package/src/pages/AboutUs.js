import React from 'react';
import {Link} from 'react-router-dom';
import CountUp from 'react-countup';


//Components 
import PageTitle from './../layouts/PageTitle';
// import TestimonialSlider from './../components/Home/TestimonialSlider';
// import ClientsSlider from './../components/Home/ClientsSlider';
// import NewsLetter from '../components/NewsLetter';

//element
// import CounterSection from './../elements/CounterSection';

//Imgaes
import about1 from './../assets/images/about/about1.jpg';
import about2 from './../assets/images/about/about2.jpg';


const missionBlog = [
    {iconClass:'flaticon-open-book-1', title:'Nhà sách tốt nhất',description: 'Bookstore cam kết mang đến những đầu sách phong phú và trải nghiệm tuyệt vời cho người yêu sách.' },
    {iconClass:'flaticon-exclusive', title:'Nơi bán hàng tin cậy', description: 'Chúng tôi tự hào là nơi khách hàng có thể tin tưởng để tìm kiếm kiến thức và giải trí từ sách.' },
    {iconClass:'flaticon-store', title:'Nâng cao trải nghiệm',description: 'Bookstore luôn đổi mới và cải tiến để mang lại những trải nghiệm mua sắm tốt nhất cho cộng đồng độc giả.' },
];

function AboutUs(){
    return(
        <>
            <div className="page-content bg-white">
               <PageTitle  parentPage="Trang chủ" childPage="Về Chúng Tôi" />
               <section className="content-inner overlay-white-middle">
                    <div className="container">
                        <div className="row about-style1 align-items-center">
                            <div className="col-lg-6 m-b30">
                                <div className="row sp10 about-thumb">
                                    <div className="col-sm-6 aos-item" >
                                        <div className="split-box">
                                            <div>
                                                <img className="m-b30" src={about1} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="split-box ">
                                            <div>
                                                <img className="m-b20 aos-item" src={about2} alt=""  />
                                            </div>
                                        </div>
                                        <div className="exp-bx aos-item" >
                                            <div className="exp-head">
                                                <div className="counter-num">
                                                    <h2><span className="counter"> <CountUp end={69} /></span><small>+</small></h2>
                                                </div>
                                                <h6 className="title">Years of Experience</h6>
                                            </div>
                                            <div className="exp-info">
                                                <ul className="list-check primary">
                                                    <li>Sách - Truyện</li>
                                                    <li>Thơ - Tiểu Thuyết</li>
                                                    <li>Sổ Tay - Công Thức</li>
                                                    <li>Từ Điển</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 m-b30 aos-item">
                                <div className="about-content px-lg-4">
                                    <div className="section-head style-1">
                                        <h3 className="title">Bookstore - Lựa chọn hàng đầu cho người yêu sách</h3>
                                        <p><strong>Bookstore</strong> mang đến cho bạn vô vàn sự lựa chọn từ những cuốn sách phổ biến nhất đến các tác phẩm chuyên sâu cho người học. Với một kho tàng tri thức phong phú, chúng tôi cam kết cung cấp trải nghiệm đọc sách tuyệt vời, giúp bạn tìm thấy những cuốn sách phù hợp và đáng tin cậy nhất. Hãy để <strong>Bookstore </strong> đồng hành cùng bạn trên hành trình tri thức!</p>
                                    </div>
                                    <Link to={"/contact-us"} className="btn btn-primary btnhover shadow-primary">Liên Hệ</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner-1 bg-light">
                    <div className="container">
                        <div className="section-head text-center">
                            <h2 className="title">Sứ mệnh của chúng tôi</h2>
                            <p>Chúng tôi tin rằng mỗi cuốn sách đều mang theo một thế giới mới, mở rộng tri thức và tâm hồn. Sứ mệnh của chúng tôi là tạo ra một không gian nơi mọi người có thể tìm thấy nguồn cảm hứng, tri thức, và những câu chuyện để nuôi dưỡng ước mơ. Chúng tôi cam kết mang đến các đầu sách phong phú, dịch vụ tận tâm và không ngừng cải tiến để phục vụ độc giả ngày càng tốt hơn.</p>
                        </div>
                        <div className="row">
                            {missionBlog.map((data, i)=>(
                                <div className="col-lg-4 col-md-6" key={i}>
                                    <div className="icon-bx-wraper style-3 m-b30">
                                        <div className="icon-lg m-b20">
                                            <i className={`icon-cell ${data.iconClass}`}></i>
                                        </div>
                                        <div className="icon-content">
                                            <h4 className="title">{data.title}</h4>
                                            <p>{data.description}</p>
                                            <Link to={"/about-us"}>Tìm hiểu thêm <i className="fa-solid fa-angles-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </section>
                </div>
            </>
        )
    }
export default AboutUs;
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//                 <section className="content-inner-1 testimonial-wrapper">
// 					<TestimonialSlider />	
// 				</section>	
//                 <section className="content-inner bg-light">
//                     <div className="container">
// 				        <div className="row sp15">
//                             <CounterSection /> 
//                          </div>
//                     </div>        
//                 </section>
//                 <div className="py-5">
// 			        <div className="container">
//                          <ClientsSlider />       
//                     </div>
//                 </div>    
//                 <NewsLetter />             
//             </div>
//         </>
//     )
// }
// export default AboutUs;