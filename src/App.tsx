import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClientLayout from "./components/Layout/ClientLayout";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id" element={<BookingDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
