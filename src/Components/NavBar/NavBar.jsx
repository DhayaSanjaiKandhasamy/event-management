import React from "react";
import "./NavBar.css";
import avatar from "../../Assets/Profile.svg";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header className="w-full shadow-[0_3px_6px_0_rgba(0,0,0,0.1)] sticky z-[1] border-b-[#eee] border-b border-solid top-0	bg-white ">
      <nav className="h-[50px] flex items-center bg-white relative h-20 gap-[38px] max-w-[1080px] w-full justify-between mx-auto my-0 w-11/12  py-10 max-w-5xl 	">
        <Link to={'/'} className="text-center text-2xl font-bold">Shaadi Hall</Link>

        <div className="grid grid-cols-[max-content_max-content_max-content] items-center gap-10">
          <div className="relative w-full">
            <div className="inline-flex items-center gap-2.5 cursor-pointer">
              <img src={avatar} alt="Cart Img" width="20" height="20" />

              <div className="flex flex-col h-full min-w-[50px]">
                <span className="font-medium text-sm leading-[19px]">
                  &nbsp; Profile
                </span>
              </div>
            </div>
          </div>

          {/* <div
            // onClick={() => setShowSidebar(true)}
            className=" border h-[50px] translate-y-0 px-3 py-[9px] rounded-lg border-solid border-[#D11243] flex items-center justify-center gap-2.5 relative cursor-pointer;"
          >
            <img src={cartImg} alt="Cart Img" width="20" height="20" />

            <div className="flex flex-col h-full min-w-[50px]">
              <span
                className="text-[#0d0d0e] text-xs font-medium leading-[16.8px]"
                style={{ fontFamily: "math" }}
              >
                <b>{0 + " Items"}</b>
              </span>
              <span
                className="text-sm text-[#0d0d0e] leading-[18.9px] w-max text-[#D11243]"
                style={{ fontFamily: "math" }}
              >
                <b>{"₹ " + 0}</b>
              </span>
            </div>
          </div> */}
          
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
