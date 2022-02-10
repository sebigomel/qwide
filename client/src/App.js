import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import UserContext from "./contexts/userContext";
function App() {
  const [user, setUser] = React.useState();
  const value = { user, setUser };

  React.useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <UserContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<Auth login={true} />} />
        <Route path="signup" element={<Auth login={false} />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
