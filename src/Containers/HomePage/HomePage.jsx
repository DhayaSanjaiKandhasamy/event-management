import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import Mahal from "../../Components/Mahal/Mahal";
import BannerImg from "../../Assets//banner.jpeg";
import ReactSearchBox from "react-search-box";
import { db } from "../../Services/firebase.config";
import { Spin } from "antd";

function HomePage() {
  const [mahals, setMahals] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMahals = async () => {
      const docsData = await getDocs(collection(db, "mahals"));
      const mahals = [];
      docsData.forEach((doc) => {
        mahals.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setMahals(mahals);
    };
    getMahals();
  }, []);

  return (
  
      <Spin spinning={loading}>
        <div className="">
          {/* <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        cart={cart}
        setCart={setCart}
      /> */}
          <main className="w-11/12	m-auto my-5 max-w-5xl	">
            <div className=" ">
              <ReactSearchBox
                placeholder="Placeholder"
                value="Doe"
                // onSelect={({ item }) => {
                //   handleClickSearchDropDown(item.key);
                // }}
                // data={dropDownDataSource}
                // callback={(record) => console.log(record)}
              />
            </div>
            <div className="mt-7 mx-0 my-6">
              <article className="aspect-[9/2] min-w-full rounded-xl">
                <img
                  src={BannerImg}
                  alt="Banner"
                  style={{ height: "60vh", objectFit: "cover", width: "100%" }}
                ></img>
              </article>
            </div>
            <header className="mb-5">
              {" "}
              <h1 className="text-xl font-bold">Marriage Halls</h1>
              <h2 className="text-gray-800">
                {" "}
                Find the most sought-after Mahals for your special day!
              </h2>
            </header>

            <div className="flex flex-wrap gap-10">
              {mahals.map((mahalData) => {
                return (
                  <Mahal
                    mahalData={mahalData}
                    key={mahalData.id}
                    // setCart={setCart}
                    // cart={cart}
                  ></Mahal>
                );
              })}
            </div>
            <br></br>
            <br></br>
          </main>
        </div>
      </Spin>
     
  );
}

export default HomePage;
