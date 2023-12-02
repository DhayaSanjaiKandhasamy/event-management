import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Services/firebase.config";
import Button from "../../Components/Utilities/Button";
import { Carousel } from "antd";
const MahalDetails = () => {
  const [mahalData, setMahalData] = useState({}); //TODO need to set to empty value
  const params = useParams();

  useEffect(() => {
    const getProduct = async () => {
      const docRef = doc(db, "mahals", params.mahalId);
      const docSnap = await getDoc(docRef);

      console.log(docSnap.data());
      setMahalData({
        ...docSnap.data(),
        id: docSnap.id,
      });
    };

    getProduct();
  }, [params]);
  const contentStyle = {
    height: "160px",
    width: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  console.log(params);
  return (
    <>
      <div
        className="flex max-w-screen-lg max-h-full relative p-1 m-auto w-11/12 mt-20 "
        style={{ gap: "5rem", minHeight: "50vh", backgroundColor: "white" }}
      >
        <div style={{ width: "600px", height:'300px',backgroundColor: "white" }}>
          <Carousel autoplay={5000}  >
            {mahalData?.imageUrls?.map((imgUrl) => (
              <img
                src={imgUrl}
                alt="Fresh Meat"
                className="rounded-2xl w-[466px] h-[348px] object-cover"
                style={{  width: "490px", height: "300px" }}
              />
            ))}
          </Carousel>
        </div>
        <div>
          <p className="h-10 text-3xl truncate font-sans font-bold">
            {mahalData.name}
          </p>
          <p className="font-serif	text-xl	text-neutral-600">{mahalData.city}</p>
          <div className="border-b">
            <div className="text-gray-800">{mahalData.description} </div>
          </div>

          <p className="font-serif	text-s	text-neutral-600	py-5">
            {mahalData.address}
          </p>

          <div className="flex flex-col  ">
            <p className="my-1">
              <span className="text-3xl	 font-bold text-red-600	 ">
                ₹{mahalData.pricePerDay}
              </span>{" "}
              <span className=" text-base	 line-through	mx-1.5 text-gray-500">
                MRP: ₹{mahalData.oldPricePerDay}
              </span>{" "}
              <span className="text-green-500	 text-base font-bold">
                {(
                  ((mahalData.oldPricePerDay - mahalData.pricePerDay) /
                    mahalData.oldPricePerDay) *
                  100
                ).toFixed(0)}
                % off
              </span>
            </p>
          </div>

          <div className="justify-between  flex items-center pt-2 border-t border-t-gray-600 gap-2">
            <p className="flex">
              <span className="text-base text-gray-500">
                <b>{mahalData.isAc ? "AC Hall" : "Non AC Hall"}</b>
              </span>
            </p>

            <span className="text-base text-red-600">
              Best Function Hall over the Town
            </span>
          </div>

          <div className="flex justify-center mt-5">
            <Button title={"Book Now"}></Button>
          </div>
        </div>
      </div>
      <footer></footer>
    </>
  );
};

export default MahalDetails;
