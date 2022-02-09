import { Routes, Route } from "react-router-dom";
import Auth from "./Pages/Auth";
function App() {
  return (
      <Routes>
        <Route path="/" element={<Auth login={true} />} />
        <Route path="signup" element={<Auth login={false} />} />
      </Routes>
  );
}

export default App;
