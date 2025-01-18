import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import FrontPage from "./pages/FrontPage";
import Signup from "./pages/Signup";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import BookingDashboard from "./pages/BookingDashboard";
import { AuthProvider } from "./contexts/AuthContextProvider"; // Import AuthProvider from the new file
import TrainBookingPage from "./pages/TrainBookingPage";
// import TrainTicketSuccess from "./pages/TrainTicketSuccess";
import TicketPdf from "./pages/TicketPdf";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/PaymentPage";
import { Elements } from "@stripe/react-stripe-js"; // Import Elements
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe
import TempSuccessPage from "./pages/TempSuccessPage";
import TempUnsuccessfulPage from "./pages/TempUnsuccessfulPage";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("your-publishable-key-here");

// Set up routes using React Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<FrontPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/admin-management" element={<AdminPage />} />
      <Route path="/booking-dashboard" element={<BookingDashboard />} />
      <Route path="/trainBooking" element={<TrainBookingPage />} />
      {/* <Route path="/success" element={<TrainTicketSuccess />} /> */}
      <Route path="/success" element={<TempSuccessPage />} />
      <Route path="/cancel" element={<TempUnsuccessfulPage />} />
      <Route path="/ticketpdf" element={<TicketPdf />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route
        path="/payment"
        element={
          // Wrap PaymentPage with the Elements provider
          <Elements stripe={stripePromise}>
            <PaymentPage />
          </Elements>
        }
      />
    </Route>
  )
);

// Render the app with the AuthProvider wrapping the RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    {/* Wrap the app with AuthProvider to provide context to all components */}
    <RouterProvider router={router} />
  </AuthProvider>
);
