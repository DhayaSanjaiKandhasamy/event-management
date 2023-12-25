import React, { useState } from "react";
import "./NavBar.css";
import avatar from "../../Assets/Profile.svg";
import { Link } from "react-router-dom";
import NormalButton from "../Utilities/NormalButton";
import { UserAuth } from "../../Context/AuthContext";
import { Input, Modal, Spin } from "antd";
import Button from "../Utilities/Button";

function NavBar() {
  const { logOut, user } = UserAuth();

  const [showModal, setShowModal] = useState(false);

  const hanldeLogOut = async () => {
    await logOut();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <header className="w-full shadow-[0_3px_6px_0_rgba(0,0,0,0.1)] sticky z-[1] border-b-[#eee] border-b border-solid top-0	bg-white ">
      <nav className="h-[50px] flex items-center bg-white relative h-20 gap-[38px] max-w-[1080px] w-full justify-between mx-auto my-0 w-11/12  py-10 max-w-5xl 	">
        <Link to={"/"} className="text-center text-2xl font-bold">
          Sri Vaigai {"    "}
          {user.isAdmin && (
            <NormalButton
              title={"Admin"}
              style={{ width: "4rem", padding: "0px", borderRadius: "1rem" }}
            ></NormalButton>
          )}
        </Link>

        <div
          className="grid grid-cols-[max-content_max-content_max-content] items-center gap-10"
          onClick={() => setShowModal(true)}
        >
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

          {showModal && (
            <Modal
              title="Profile Details"
              footer={() => {}}
              open={showModal}
              onCancel={handleCloseModal}
              style={{ width: "70%" }}
            >
              <Spin spinning={false}>
                <div className="flex gap-5 flex-col mt-5">
                  <div className="flex items-center justify-between gap-5">
                    <label className="whitespace-nowrap">Name :</label>
                    <Input
                      // onChange={(e) => {
                      //   handleValueChange("groomName", e.target.value);
                      // }}
                      value={user.name}
                      disabled
                      type="text"
                      className="w-4/6"
                    ></Input>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <label className="whitespace-nowrap">Email :</label>
                    <Input
                      // onChange={(e) => {
                      //   handleValueChange("brideName", e.target.value);
                      // }}
                      value={user.email}
                      type="text"
                      disabled
                      className="w-4/6"
                    ></Input>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <label className="whitespace-nowrap"> Phone No :</label>
                    <Input
                      // onChange={(e) => {
                      //   handleValueChange("address", e.target.value);
                      // }}
                      value={user.phoneNo}
                      disabled
                      type="address"
                      className="w-4/6"
                    ></Input>
                  </div>

                  <div className="flex justify-center mt-5">
                    <Button
                      title={"Log Out"}
                      onClick={hanldeLogOut}
                    ></Button>
                  </div>
                </div>
              </Spin>
            </Modal>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
