import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientLayout from "./components/Layout/ClientLayout";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
import DetailRoom from "./pages/DetailRoom";
import ListRoomm from "./pages/ListRoom";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Room from "./pages/dashboard/Room";
import CategoryRoom from "./pages/dashboard/Category";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id" element={<BookingDetail />} />
          <Route path="/list-room/:id" element={<DetailRoom />} />
          <Route path="/list-room" element={<ListRoomm />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/category-room" element={<CategoryRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
