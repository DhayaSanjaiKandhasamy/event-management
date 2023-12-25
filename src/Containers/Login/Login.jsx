import React from "react";
import Button from "../../Components/Utilities/Button";
import { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImg  from "../../Assets/event-planner.avif";
const Login = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
    console.log(user)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  

  return (
    <div className="flex h-screen items-center justify-around ">
      <div className="w-7/10">
        <img
          src={loginImg}
          alt="Shree Vaigai"
          style={{ height: "60vh", objectFit: "cover", width: "100%" }}
        />
      </div>
      <div className="w-3/10 flex flex-col justify-around items-center gap-12 p-5">
        <h1 className="text-4xl font-bold ">Sri Vaigai Event Planners</h1>
        <GoogleButton onClick={handleGoogleSignIn} />
      </div>
    </div>
  );
};

export default Login;
