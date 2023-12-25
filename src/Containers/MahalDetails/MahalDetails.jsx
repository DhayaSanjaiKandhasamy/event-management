import { UserAuth } from "../../Context/AuthContext";
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../Services/firebase.config";
import Button from "../../Components/Utilities/Button";
import { Carousel, Checkbox, DatePicker, Input, Modal, Spin } from "antd";

import notification from "../../Components/Feedback/Notification";
import moment from "moment";
import NormalButton from "../../Components/Utilities/NormalButton";
const initialData = {
  groomName: "",
  brideName: "",
  startDate: null,
  endDate: null,
  address: "",
  phoneNo: "",
  caterings: false,
  photography: false,
  decorations: false,
};
const MahalDetails = () => {
  const [mahalData, setMahalData] = useState({}); //TODO need to set to empty value
  const params = useParams();
  const { mahalId } = params;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState(initialData);
  const { user } = UserAuth();

  useEffect(() => {
    const getMahals = async () => {
      setLoading(true);
      const docRef = doc(db, "mahals", mahalId);
      const docSnap = await getDoc(docRef);

      console.log(docSnap.data());
      setMahalData({
        ...docSnap.data(),
        id: docSnap.id,
      });
      setLoading(false);
    };

    getMahals();
  }, [mahalId]);

  useEffect(() => {
    const getBookingDetails = async () => {
      setLoading(true);
      const docsData = await getDocs(
        collection(db, "mahals", mahalId, "bookings")
      );
      const bookingsData = [];
      docsData.forEach((doc) => {
        bookingsData.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setLoading(false);
      setBookings(bookingsData);
    };
    getBookingDetails();
  }, []);

  const handleShowBookModal = () => {
    setShowModal(true);
  };

  const { RangePicker } = DatePicker;

  const handleChangeDate = (e) => {
    setNewBooking({
      startDate: e[0],
      endDate: e[1],
    });
  };

  const handleValueChange = (fieldName, value) => {
    setNewBooking((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleSubmitForm = async () => {
    try {
      setModalLoading(true);
      const newBookingData = {
        groomName: newBooking.groomName,
        brideName: newBooking.brideName,
        startDate: Timestamp.fromDate(
          newBooking.startDate.startOf("Day").toDate()
        ),
        endDate: Timestamp.fromDate(newBooking.endDate.endOf("Day").toDate()),
        address: newBooking.address,
        phoneNo: newBooking.phoneNo,
        caterings: newBooking.caterings ?? false, 
        photography: newBooking.photography ?? false,
        decorations: newBooking.decorations ?? false,
      };
      const bookingsCollRef = collection(db, "mahals", mahalId, "bookings");
      const ref = await addDoc(bookingsCollRef, newBookingData);
      setNewBooking(initialData);

      notification("success", "Booked Successfully");
      setShowModal(false);
    } catch (err) {
      console.log(err);
      notification("error", "Something Went Wrong, Please Try Again Later");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewBooking(initialData);
  };

  const checkDateAvailability = (momentObj) => {
    const dateObj = momentObj.toDate();
    const result = bookings.some(
      (booking) =>
        booking.startDate.toDate() < dateObj &&
        booking.endDate.toDate() > dateObj
    );
    return result;
  };
  return (
    <Spin spinning={loading}>
      <div
        className="flex max-w-screen-lg max-h-full relative p-1 m-auto w-11/12 mt-20 "
        style={{ gap: "5rem", minHeight: "50vh", backgroundColor: "white" }}
      >
        <div
          style={{ width: "600px", height: "300px", backgroundColor: "white" }}
        >
          <Carousel autoplay={5000}>
            {mahalData?.imageUrls?.map((imgUrl) => (
              <img
                src={imgUrl}
                alt="Fresh Meat"
                className="rounded-2xl w-[466px] h-[348px] object-cover"
                style={{ width: "490px", height: "300px" }}
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
            <Button title={"Book Now"} onClick={handleShowBookModal}></Button>
          </div>
        </div>
      </div>
      <div className=" max-w-screen-lg m-auto w-11/12 mt-20">
        <div className="flex gap-5 items-center">
          <h1 className="h-10 text-3xl truncate font-sans font-bold m-10">
            Venue Highlights
          </h1>

          {user.isAdmin && (
            <Link to={`/mahal/${mahalData.id}/bookings`}>
              <NormalButton title="View Bookings" style={{ width: "10rem" }}>
                {" "}
              </NormalButton>
            </Link>
          )}
        </div>
        <div class="grid grid-cols-2 gap-3 md:gap-6 ">
          <div class="flex flex-col space-y-2 rounded-2xl bg-white p-3 shadow-xl md:space-y-3 md:p-7">
            <svg
              width="30"
              height="31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-[0.8] md:scale-100"
            >
              <path
                d="M27.037 10.553h-1.665v-6.07c0-1.587-1.284-2.866-2.835-2.866H7.55a2.74 2.74 0 0 0-1.073.217c-.34.143-.649.354-.91.62-.26.267-.466.583-.607.931-.14.348-.213.721-.212 1.098v6.07H2.964a.436.436 0 0 0-.321.14.456.456 0 0 0-.123.335v12.583c0 .265.185.497.444.497h.376v4.51a.486.486 0 0 0 .144.336.467.467 0 0 0 .333.132h3.927a.442.442 0 0 0 .327-.134.463.463 0 0 0 .133-.333v-4.511H21.68v4.51c0 .266.232.468.491.468h3.927a.43.43 0 0 0 .321-.136.45.45 0 0 0 .124-.331v-4.511h.494c.26 0 .444-.232.444-.497V11.028a.464.464 0 0 0-.123-.334.443.443 0 0 0-.32-.14ZM5.684 4.483a1.941 1.941 0 0 1 .545-1.35c.174-.177.38-.318.606-.413a1.82 1.82 0 0 1 .714-.143h14.988c1.034 0 1.897.848 1.897 1.906v6.07h-2.263a.49.49 0 0 0-.49.475v7.622H8.32v-7.622a.49.49 0 0 0-.491-.475H5.684v-6.07Zm1.582 23.643H4.278v-4.018h2.988v4.018Zm18.34 0h-2.988v-4.018h2.988v4.018Zm.937-4.978H3.457V11.513h3.926v7.642a.45.45 0 0 0 .127.327.429.429 0 0 0 .32.128H22.17a.42.42 0 0 0 .32-.128.44.44 0 0 0 .127-.327v-7.642h3.925v11.635Z"
                fill="#FF5B91"
              ></path>
            </svg>

            <label class="text-xs uppercase tracking-[0.15em] md:text-base">
              SEATING{" "}
            </label>
            <span class="text-base font-bold md:text-2xl">
              {mahalData.hallCapacity}
            </span>
          </div>
          <div class="flex flex-col space-y-2 rounded-2xl bg-white p-3 shadow-xl md:space-y-3 md:p-7">
            <svg
              width="80"
              height="80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-75 md:ml-2 md:scale-100"
            >
              <g clip-path="url(#OpenTerraceIcon_svg__a)">
                <path
                  d="M40.266 24.953V49.12M26.273 49.125h27.983M37.719 49.125v3.88c0 .667.54 1.208 1.208 1.208h2.671c.668 0 1.209-.541 1.209-1.209v-3.879M40.266 54.21v13.992M35.172 68.197v0a5.088 5.088 0 0 1 5.088-5.088v0a5.088 5.088 0 0 1 5.087 5.088v0M8.465 41.492v0a4.602 4.602 0 0 1 2.544 4.116v14.963m-1.272 7.632 1.107-5.539c.11-.546.165-1.102.165-1.659v-.434m0 0h13.99m0 0 1.273 7.632M25 60.57v0a6.36 6.36 0 0 0-6.36-6.36h-6.36M72.063 42.766v0a4.602 4.602 0 0 0-2.544 4.116v14.963m1.272 7.631-1.108-5.538a8.461 8.461 0 0 1-.164-1.659v-.434m0 0H55.527m0 0-1.272 7.631m1.272-7.631v0a6.36 6.36 0 0 1 6.36-6.36h6.36"
                  stroke="#FF5B91"
                  stroke-width="1.8"
                  stroke-linecap="round"
                ></path>
                <path
                  d="m74.322 24.945-51.971-.682H4.888a2.888 2.888 0 0 1-.768-5.673L36.824 9.57a8.458 8.458 0 0 1 4.146-.09l34.263 7.884a3.84 3.84 0 0 1-.911 7.582Z"
                  fill="#fff"
                ></path>
                <path
                  d="M78.421 21.141c-.084-1.935-.58-2.77-2.417-3.749a1.164 1.164 0 0 0-.265-.101L40.556 8.495a1.208 1.208 0 0 0-.586 0L4.881 17.267a1.182 1.182 0 0 0-.424.202c-1.771 1.333-2.295 2.12-2.352 3.672M25 18.597 40.263 8.422M55.529 18.597 40.266 8.422"
                  stroke="#FF5B91"
                  stroke-width="1.8"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M2.105 23.753V19.81c0-.667.541-1.208 1.209-1.208h20.414v5.15c0 .668-.54 1.21-1.208 1.21H3.314a1.208 1.208 0 0 1-1.209-1.21ZM56.797 19.873v3.88c0 .667.54 1.208 1.208 1.208h19.206c.668 0 1.209-.54 1.209-1.208V19.81c0-.667-.541-1.208-1.209-1.208H64.43"
                  stroke="#FF5B91"
                  stroke-width="1.8"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M60.612 18.602h-3.815m0 0h-33.07v5.15c0 .668.54 1.21 1.208 1.21h30.653c.668 0 1.209-.542 1.209-1.21v-5.15Z"
                  stroke="#FF5B91"
                  stroke-width="1.8"
                  stroke-linecap="round"
                ></path>
              </g>
              <defs>
                <clipPath id="OpenTerraceIcon_svg__a">
                  <path fill="#fff" d="M0 0h80v80H0z"></path>
                </clipPath>
              </defs>
            </svg>

            <label class="text-xs uppercase tracking-[0.15em] md:text-base">
              BUFFETHALL SEATING
            </label>
            <span class="text-base font-bold md:text-2xl">
              {mahalData.buffetHallCapacity}
            </span>
          </div>
          <div class="flex flex-col space-y-2 rounded-2xl bg-white p-3 shadow-xl md:space-y-3 md:p-7">
            <svg
              width="30"
              height="30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-[0.8] md:scale-100"
            >
              <path
                d="M.802 16.852c-.254 0-.458-.256-.458-.572 0-2.204 1.438-3.999 3.206-3.999.253 0 .458.256.458.572 0 .315-.205.57-.458.57-1.263 0-2.29 1.282-2.29 2.857 0 .316-.205.572-.458.572Zm28.394 0c-.252 0-.458-.256-.458-.572 0-1.575-1.027-2.856-2.29-2.856-.253 0-.457-.256-.457-.571 0-.316.204-.572.457-.572 1.767 0 3.206 1.794 3.206 4 0 .315-.204.57-.458.57Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M26.448 13.424H3.55c-.254 0-.458-.256-.458-.571 0-.316.204-.572.458-.572h22.898c.254 0 .459.256.459.572 0 .315-.205.57-.459.57ZM.802 22.568c-.254 0-.458-.256-.458-.572V16.28c0-.316.204-.571.458-.571.253 0 .458.255.458.57v5.718c0 .316-.205.57-.458.57Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M1.718 23.713c-.758 0-1.374-.77-1.374-1.714 0-.316.204-.571.458-.571.253 0 .458.255.458.57 0 .316.205.572.458.572s.458.256.458.572c0 .316-.205.57-.458.57Zm27.478-1.143c-.253 0-.458-.255-.458-.571v-5.717c0-.316.205-.571.458-.571.254 0 .458.255.458.571V22c0 .316-.204.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M28.282 23.715c-.253 0-.458-.255-.458-.571 0-.316.205-.572.458-.572s.458-.256.458-.571c0-.316.205-.571.458-.571s.458.255.458.571c0 .945-.616 1.714-1.374 1.714Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M28.28 23.711H1.718c-.254 0-.458-.255-.458-.571 0-.316.204-.571.458-.571H28.28c.254 0 .458.255.458.571 0 .316-.204.571-.458.571Zm.916-2.857H.802c-.254 0-.458-.256-.458-.572 0-.316.204-.571.458-.571h28.394c.254 0 .458.255.458.571 0 .316-.204.572-.458.572Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M2.634 25.997c-.253 0-.458-.255-.458-.571v-2.284c0-.316.204-.572.458-.572.253 0 .458.256.458.572v2.284c0 .316-.205.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M7.214 26.002h-4.58c-.253 0-.458-.255-.458-.571 0-.316.204-.572.458-.572h4.58c.253 0 .458.256.458.572 0 .316-.205.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M7.212 25.997c-.253 0-.458-.255-.458-.571v-2.284c0-.316.205-.572.458-.572s.458.256.458.572v2.284c0 .316-.205.571-.458.571Zm15.57 0c-.254 0-.459-.255-.459-.571v-2.284c0-.316.205-.572.458-.572.254 0 .458.256.458.572v2.284c0 .316-.204.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M27.366 26.002h-4.58c-.253 0-.458-.255-.458-.571 0-.316.205-.572.458-.572h4.58c.253 0 .458.256.458.572 0 .316-.205.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M27.362 25.997c-.253 0-.458-.256-.458-.572v-2.284c0-.316.204-.571.458-.571.253 0 .458.255.458.571v2.284c0 .316-.205.572-.458.572ZM3.548 13.426c-.253 0-.458-.256-.458-.572v-9.14c0-.315.205-.571.458-.571s.458.256.458.571v9.14c0 .316-.205.572-.458.572Zm22.899 0c-.253 0-.458-.256-.458-.572v-9.14c0-.315.204-.571.458-.571.253 0 .458.256.458.571v9.14c0 .316-.205.572-.458.572ZM25.53 3.143H4.465c-.254 0-.458-.256-.458-.572 0-.315.204-.571.458-.571H25.53c.253 0 .458.256.458.571 0 .316-.205.572-.458.572ZM6.295 11.142c-.253 0-.458-.256-.458-.572 0-.945.616-1.714 1.374-1.714.253 0 .458.256.458.571 0 .316-.205.571-.458.571s-.458.257-.458.572c0 .316-.205.572-.458.572Zm7.33 0c-.254 0-.459-.256-.459-.572 0-.314-.205-.57-.458-.57s-.458-.256-.458-.572c0-.315.205-.571.458-.571.758 0 1.374.768 1.374 1.713 0 .316-.205.572-.458.572Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M6.298 13.421c-.253 0-.458-.255-.458-.57v-2.286c0-.315.205-.571.458-.571s.458.256.458.57v2.286c0 .316-.205.572-.458.572Zm7.33 0c-.254 0-.459-.256-.459-.572v-2.284c0-.315.205-.57.458-.57.254 0 .458.255.458.57v2.284c0 .316-.204.571-.458.571Zm-.917-3.427H7.214c-.253 0-.458-.256-.458-.571 0-.315.205-.571.458-.571h5.497c.254 0 .458.256.458.57 0 .316-.204.572-.458.572ZM16.376 11.145c-.253 0-.458-.256-.458-.571 0-.945.616-1.715 1.374-1.715.253 0 .458.256.458.572 0 .315-.205.571-.458.571s-.458.256-.458.572c0 .316-.205.571-.458.571Zm7.33 0c-.254 0-.459-.256-.459-.571 0-.315-.205-.57-.457-.57-.254 0-.459-.257-.459-.572 0-.316.205-.571.459-.571.757 0 1.373.768 1.373 1.713 0 .316-.204.571-.458.571Z"
                fill="#6B70E8"
              ></path>
              <path
                d="M16.376 13.43c-.253 0-.458-.257-.458-.572v-2.285c0-.316.205-.572.458-.572s.458.256.458.572v2.285c0 .316-.205.571-.458.571Zm7.33-.002c-.254 0-.459-.256-.459-.571v-2.284c0-.315.205-.571.458-.571.254 0 .458.256.458.571v2.284c0 .315-.204.571-.458.571Zm-.916-3.426h-5.498c-.253 0-.458-.256-.458-.571 0-.316.205-.572.458-.572h5.497c.254 0 .458.256.458.572 0 .315-.204.571-.457.571ZM3.548 4.286c-.253 0-.458-.256-.458-.57C3.09 2.77 3.707 2 4.465 2c.253 0 .458.256.458.571 0 .316-.205.572-.458.572-.254 0-.46.257-.46.572 0 .315-.204.571-.457.571ZM26.45 4.286c-.254 0-.459-.256-.459-.57 0-.316-.206-.573-.459-.573s-.458-.256-.458-.572c0-.315.205-.571.458-.571.758 0 1.375.77 1.375 1.715 0 .316-.205.571-.458.571Z"
                fill="#6B70E8"
              ></path>
            </svg>
            <label class="text-xs uppercase tracking-[0.15em] md:text-base">
              ROOMS
            </label>
            <span class="text-base font-bold md:text-2xl">
              {mahalData.roomsAvailable}
            </span>
          </div>
          <div class="flex flex-col space-y-2 rounded-2xl bg-white p-3 shadow-xl md:space-y-3 md:p-7">
            <svg
              width="30"
              height="31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-[0.8] md:scale-100"
            >
              <path
                d="M26.307 27.915H3.713c-.09 0-.178-.006-.266-.015.079.012.155.02.234.033a2.034 2.034 0 0 1-.457-.126l.21.09a2.158 2.158 0 0 1-.371-.21c-.114-.078.146.126.07.057-.04-.04-.088-.078-.129-.12a1.902 1.902 0 0 1-.102-.117c-.1-.111.1.15.055.075l-.044-.066a2.074 2.074 0 0 1-.172-.33l.087.216a2.11 2.11 0 0 1-.123-.468c.012.08.02.159.033.24-.033-.267-.015-.546-.015-.816V3.8c0-.093.006-.183.015-.273-.012.08-.02.159-.033.24.024-.162.065-.315.123-.468l-.087.216c.046-.111.1-.216.16-.315.015-.021.03-.042.045-.066.076-.117-.123.15-.056.072.038-.042.076-.09.117-.132.035-.036.076-.072.114-.105.109-.102-.146.102-.073.057a1.995 1.995 0 0 1 .387-.222l-.211.09c.146-.06.299-.102.457-.126l-.234.033c.26-.033.533-.015.796-.015h22.04c.091 0 .18.006.267.015l-.234-.033c.158.024.307.066.457.126l-.211-.09a2.17 2.17 0 0 1 .372.21c.114.078-.147-.126-.07-.057.04.039.087.078.128.12.036.036.07.078.103.117.1.11-.1-.15-.056-.075a2.074 2.074 0 0 1 .217.396l-.088-.216c.059.15.1.306.123.468-.011-.081-.02-.16-.032-.24.032.267.015.545.015.815v22.56c0 .093-.006.183-.015.273.012-.081.02-.16.032-.24a2.158 2.158 0 0 1-.123.468l.088-.216a2.262 2.262 0 0 1-.205.38c-.076.118.123-.15.056-.071-.038.042-.076.09-.117.132a1.926 1.926 0 0 1-.115.105c-.108.102.147-.102.074-.057a1.985 1.985 0 0 1-.387.222l.21-.09c-.146.06-.298.102-.456.126.079-.012.155-.021.234-.034a2.203 2.203 0 0 1-.243.015c-.46.006-.9.411-.879.9.02.483.387.906.879.9 1.102-.012 2.083-.69 2.51-1.727a3.01 3.01 0 0 0 .215-1.146V3.817c0-.564-.15-1.146-.475-1.608-.53-.755-1.339-1.217-2.256-1.223-.272-.003-.545 0-.82 0H3.853c-.081 0-.163-.003-.245.003-1.143.05-2.104.797-2.493 1.889-.164.462-.15.942-.15 1.421V26.895c0 .639.2 1.235.577 1.74A2.717 2.717 0 0 0 3.7 29.72H26.307c.46 0 .9-.414.879-.9-.02-.495-.387-.905-.879-.905Z"
                fill="#930000"
              ></path>
              <path
                d="M19.602 11.944c0 .246-.017.49-.05.732l.033-.24a5.628 5.628 0 0 1-.355 1.329c.03-.072.06-.144.088-.216a5.503 5.503 0 0 1-.618 1.112c-.1.141.047-.036.041-.054.003.01-.079.1-.085.108a5.052 5.052 0 0 1-.703.72l-.088.072c-.082.069.17-.13.053-.042-.073.054-.146.108-.223.162-.278.192-.574.35-.881.486l.21-.09c-.416.177-.85.3-1.295.365.08-.012.156-.02.235-.033-.36.051-.72.051-1.084.051H9.52l.88.9V7.905c0-.435.011-.873 0-1.308V6.58l-.88.9h5.265c.387 0 .77-.004 1.157.047-.079-.012-.155-.02-.234-.033.46.066.905.189 1.333.372l-.21-.09a5.23 5.23 0 0 1 1.074.63c.159.12-.093-.078-.04-.033.034.03.07.057.105.087.123.105.243.216.354.333.111.117.223.237.325.362.024.03.05.06.074.093.096.123-.141-.195-.033-.042.05.07.1.138.147.21.187.285.348.591.48.906l-.088-.216c.18.438.302.894.364 1.364-.012-.08-.02-.159-.033-.24.027.243.041.477.041.714.003.471.405.92.88.9.474-.021.881-.396.878-.9a6.432 6.432 0 0 0-1.596-4.207 6.016 6.016 0 0 0-1.63-1.304 6.173 6.173 0 0 0-2.238-.705c-.58-.072-1.18-.042-1.763-.042H9.516c-.475 0-.88.41-.88.9v9.401c0 .434-.008.872 0 1.307v.018c0 .486.402.9.88.9h5.692c.592 0 1.195-.081 1.764-.255a6.332 6.332 0 0 0 2.156-1.185c1.412-1.157 2.227-2.986 2.232-4.825.003-.47-.407-.92-.879-.9a.903.903 0 0 0-.879.897Z"
                fill="#930000"
              ></path>
              <path
                d="M10.398 6.596c0-.471-.404-.921-.878-.9a.904.904 0 0 0-.88.9V24.11c0 .471.405.921.88.9a.904.904 0 0 0 .878-.9V9.738c0-1.028.012-2.06 0-3.088-.002-.024 0-.04 0-.054 0-.471-.404-.921-.878-.9a.904.904 0 0 0-.88.9c0 .47.405.92.88.9.474-.025.878-.397.878-.9Z"
                fill="#930000"
              ></path>
            </svg>
            <label class="text-xs uppercase tracking-[0.15em] md:text-base">
              Parking
            </label>
            <span class="text-base font-bold md:text-2xl">
              {mahalData.parkingSpace}
            </span>
          </div>
        </div>

        <Modal
          title="Book Mahal"
          footer={() => {}}
          open={showModal}
          onCancel={handleCloseModal}
          style={{ width: "70%" }}
        >
          <Spin spinning={modalLoading}>
            <div className="flex gap-5 flex-col mt-5">
              <div className="flex items-center justify-between gap-5">
                <label>Select Date :</label>
                <RangePicker
                  onChange={handleChangeDate}
                  className="w-4/6"
                  disabledDate={(date) => checkDateAvailability(date)}
                  value={[newBooking.startDate, newBooking.endDate]}
                ></RangePicker>
              </div>

              <div className="flex items-center justify-between gap-5">
                <label className="whitespace-nowrap">Groom Name :</label>
                <Input
                  onChange={(e) => {
                    handleValueChange("groomName", e.target.value);
                  }}
                  value={newBooking.groomName}
                  type="text"
                  className="w-4/6"
                ></Input>
              </div>

              <div className="flex items-center justify-between gap-5">
                <label className="whitespace-nowrap">Bride Name :</label>
                <Input
                  onChange={(e) => {
                    handleValueChange("brideName", e.target.value);
                  }}
                  value={newBooking.brideName}
                  type="text"
                  className="w-4/6"
                ></Input>
              </div>

              <div className="flex items-center justify-between gap-5">
                <label className="whitespace-nowrap"> Address :</label>
                <Input
                  onChange={(e) => {
                    handleValueChange("address", e.target.value);
                  }}
                  value={newBooking.address}
                  type="address"
                  className="w-4/6"
                ></Input>
              </div>

              <div className="flex items-center justify-between gap-5">
                <label className="whitespace-nowrap">Phone No :</label>
                <Input
                  onChange={(e) => {
                    handleValueChange("phoneNo", e.target.value);
                  }}
                  value={newBooking.phoneNo}
                  type="number"
                  className="w-4/6"
                ></Input>
              </div>

              <hr></hr>
              <div>Other Bookings</div>
              <div className="flex items-center gap-5">
                <Checkbox
                  onChange={(e) => {
                    handleValueChange("caterings", e.target.checked);
                  }}
                  checked={newBooking.caterings}
                  // className="w-4/6"
                >
                  {" "}
                  Caterings{" "}
                </Checkbox>
                <Checkbox
                  onChange={(e) => {
                    handleValueChange("decorations", e.target.checked);
                  }}
                  checked={newBooking.decorations}
                  // className="w-4/6"
                >
                  Decorations{" "}
                </Checkbox>
                <Checkbox
                  onChange={(e) => {
                    handleValueChange("photography", e.target.checked);
                  }}
                  checked={newBooking.photography}
                  // className="w-4/6"
                >
                  {" "}
                  Photography{" "}
                </Checkbox>
              </div>

              <div className="flex justify-center mt-5">
                <Button title={"Book"} onClick={handleSubmitForm}></Button>
              </div>
            </div>
          </Spin>
        </Modal>
      </div>
    </Spin>
  );
};

export default MahalDetails;

// const Fieldset = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 20px;

//   &:last-child {
//     margin-bottom: 0;
//   }
// `;
