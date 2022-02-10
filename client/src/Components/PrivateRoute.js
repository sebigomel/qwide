import React from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";

export default function PrivateRoute() {
  let navigate = useNavigate();
  const { user } = React.useContext(UserContext);
  React.useEffect(() => {
    if (user === "Unknown") return navigate("/");
  }, [user, navigate]);
  return <></>;
}
