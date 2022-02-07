import React, { useState, useEffect } from "react";
import server from "../Config/axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginData, setLoginData] = useState({});
  let navigate = useNavigate();

  const handleAlertClose = () => {
    let copyOfObject = { ...loginData };
    delete copyOfObject["error"];

    setLoginData((prevData) => ({
      ...copyOfObject,
    }));
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await server.get("/user");
        return response;
      };
      const response = fetchData();
      if (response.data.redirectUrl) navigate(response.data.redirectUrl);
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  const handleChange = (e) => {
    let updatedValue = {};
    updatedValue[e.target.name] = e.target.value;
    setLoginData((prevData) => ({
      ...prevData,
      ...updatedValue,
    }));
  };
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await server.put("/user", loginData);
      console.log(response.status, response.data);
      navigate("products");
    } catch (err) {
      let updatedValue = {};
      updatedValue = { error: err.response.data.message };
      setLoginData((prevData) => ({
        ...prevData,
        ...updatedValue,
      }));
      setTimeout(() => handleAlertClose(), 4000);
    }
  };
  return <div></div>;
}
