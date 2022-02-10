import React from "react";

const UserContext = React.createContext({
  user: "Unknown",
  setUser: () => {},
});

export default UserContext;
