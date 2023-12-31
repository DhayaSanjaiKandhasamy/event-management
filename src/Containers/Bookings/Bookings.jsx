import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import ReactSearchBox from "react-search-box";
import { db } from "../../Services/firebase.config";
import { Popconfirm, Spin, Table, notification } from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
import NormalButton from "../../Components/Utilities/NormalButton";
import showNotification from "../../Components/Feedback/Notification";
import { formatNum } from "../../Helpers/helpers";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [mahalData, setMahalData] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { mahalId } = params;

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

  useEffect(() => {
    const getMahals = async () => {
      setLoading(true);
      const docRef = doc(db, "mahals", mahalId);
      const docSnap = await getDoc(docRef);

      setMahalData({
        ...docSnap.data(),
        id: docSnap.id,
      });
      setLoading(false);
    };

    getMahals();
  }, [mahalId]);

  const hanldeCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const docRef = await deleteDoc(
        doc(db, `mahals/${mahalData.id}/bookings`, bookingId)
      );
      setBookings((prevBookings) => {
        return prevBookings.filter((booking) => booking.id !== bookingId);
      });
      showNotification("success", "Cancelled Succesfully");
    } catch (err) {
      console.log(err);
      showNotification("error", "Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: "Groom Name",
      dataIndex: "groomName",
      width: "10%",
      key: "groomName",
      sorter: (a, b) => {
        if (a.groomName < b.groomName) return -1;
        if (a.groomName > b.groomName) return 1;
        return 0;
      },
    },
    {
      title: "Bride Name",
      dataIndex: "brideName",
      width: "10%",
      key: "brideName",
      sorter: (a, b) => {
        if (a.brideName < b.brideName) return -1;
        if (a.brideName > b.brideName) return 1;
        return 0;
      },
    },

    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      width: "10%",

      sorter: (a, b) => {
        if (a.phoneNo < b.phoneNo) return -1;
        if (a.phoneNo > b.phoneNo) return 1;
        return 0;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "10%",

      render: (totalPrice) => {
        return (
          <p className="font-bold text-[#d11243]">{formatNum(totalPrice)}</p>
        );
      },
      sorter: (a, b) => {
        if (a.totalPrice < b.totalPrice) return -1;
        if (a.totalPrice > b.totalPrice) return 1;
        return 0;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "adress",
      width: "10%",
      sorter: (a, b) => {
        if (a.adress < b.adress) return -1;
        if (a.adress > b.adress) return 1;
        return 0;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: "15%",
      render: (startDate) => {
        return <p>{moment(startDate.toDate()).format("DD MMM YYYY")}</p>;
      },
      sorter: (a, b) => {
        if (a.startDate.toMillis() < b.startDate.toMillis()) return -1;
        if (a.startDate.toMillis() > b.startDate.toMillis()) return 1;
        return 0;
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: "15%",
      render: (endDate) => {
        return <p>{moment(endDate.toDate()).format("DD MMM YYYY")}</p>;
      },
      sorter: (a, b) => {
        if (a.endDate.toMillis() < b.endDate.toMillis()) return -1;
        if (a.endDate.toMillis() > b.endDate.toMillis()) return 1;
        return 0;
      },
    },
    {
      title: "Caterings",
      dataIndex: "caterings",
      key: "caterings",
      width: "10%",
      render: (caterings) => {
        return <p>{caterings ? "YES" : "NO"}</p>;
      },
      sorter: (a, b) => {
        if (a.caterings < b.caterings) return -1;
        if (a.caterings > b.caterings) return 1;
        return 0;
      },
    },
    {
      title: "Decorations",
      dataIndex: "decorations",
      key: "decorations",
      width: "10%",
      render: (decorations) => {
        return <p>{decorations ? "YES" : "NO"}</p>;
      },
      sorter: (a, b) => {
        if (a.decorations < b.decorations) return -1;
        if (a.decorations > b.decorations) return 1;
        return 0;
      },
    },
    {
      title: "Photography",
      dataIndex: "photography",
      key: "photography",
      width: "10%",
      render: (photography) => {
        return <p>{photography ? "YES" : "NO"}</p>;
      },
      sorter: (a, b) => {
        if (a.photography < b.photography) return -1;
        if (a.photography > b.photography) return 1;
        return 0;
      },
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: "10%",

      render: (bookingDetails) => {
        return (
          <Popconfirm
            title="Cancel Booking"
            description="Are you sure to cancel this booking?"
            onConfirm={() => hanldeCancelBooking(bookingDetails.id)}
            okText="Yes"
            cancelText="No"
          >
            <NormalButton title={"Cancel"}></NormalButton>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="">
        <main className="w-11/12	m-auto my-5 max-w-5xl	">
          <div className=" "></div>
          <h1 className="h-10 text-3xl truncate font-sans font-bold my-10">
            Booking Details - {mahalData.name}
          </h1>
          <Table
            rowKey="id"
            columns={bookingColumns}
            dataSource={bookings}
            className="isoSimpleTable"
            bordered={true}
            scroll={{ x: 1500 }}
          ></Table>
        </main>
      </div>
    </Spin>
  );
}

export default Bookings;
