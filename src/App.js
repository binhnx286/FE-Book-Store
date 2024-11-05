import React from "react";
import Index from "./pages/Index";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Css
import "./assets/css/style.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginBottom: "100px" }}
      />
      <Index />
    </div>
  );
}

export default App;
