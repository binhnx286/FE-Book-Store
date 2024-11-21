import React from "react";
import CountUp from "react-countup";

const counterBlog = [
  { iconClass: "fa-users", number: "125663", title: "Khách hàng hài lòng" },
  { iconClass: "fa-book", number: "2000", title: "Bộ sưu tập sách" },
  { iconClass: "fa-store", number: "9", title: "Cửa hàng của chúng tôi" },
  { iconClass: "fa-leaf", number: "267", title: "Tác giả nổi tiếng" },
];

const CounterSection = () => {
  return (
    <>
      {counterBlog.map((data, i) => (
        <div className="col-lg-3 col-md-6 col-sm-6 col-6" key={i}>
          <div className="icon-bx-wraper style-2 m-b30 text-center">
            <div className="icon-bx-lg">
              <i className={`fa-solid icon-cell ${data.iconClass}`}></i>
            </div>
            <div className="icon-content">
              <h2 className="dz-title counter m-b0">
                {" "}
                <CountUp end={data.number} separator="," duration={3} />
              </h2>
              <p className="font-20">{data.title}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default CounterSection;
