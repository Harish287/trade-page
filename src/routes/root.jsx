import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../footer"
// import SCroll from "../scrolltop"

export default function Root() {
  return (
    <div>
      {/* <Header /> */}
     
      <div className="content">
        <Outlet />    
        {/* <SCroll/> */}
        {/* <Footer /> */}
     
      </div>
    </div>
  );
}
