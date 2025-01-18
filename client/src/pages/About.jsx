/* eslint-disable react/no-unescaped-entities */
import { FaTrain, FaBus, FaPlane, FaPhoneAlt } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-10">
      {/* Hero Section */}
      <section className="text-center bg-blue-600 text-white py-12 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
          Welcome to Our Website
        </h1>
        <p className="text-base sm:text-lg">
          Your one-stop solution for booking train, bus, and flight tickets
          seamlessly.
        </p>
      </section>

      {/* Who We Are Section */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Who We Are
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          At TravelHub, we understand that every journey is unique, which is why
          we offer an extensive selection of travel options to cater to various
          budgets, preferences, and schedules. Whether you're planning a quick
          getaway or a long journey, we provide the best transportation
          solutions to meet your needs.
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          Our team is dedicated to providing you with the best booking
          experience, powered by cutting-edge technology and a customer-first
          approach. With years of experience in the travel industry, we've built
          strong partnerships with top transportation providers to give you
          access to reliable and affordable travel options.
        </p>
      </section>

      {/* Our Services Section */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <FaTrain className="text-3xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">
              Train Tickets
            </h3>
            <p className="text-gray-600">
              Travel in comfort with our wide range of train options. Whether
              you're commuting locally or embarking on a long-distance journey,
              we provide tickets for all major routes with real-time seat
              availability and competitive prices.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <FaBus className="text-3xl text-green-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">Bus Tickets</h3>
            <p className="text-gray-600">
              Need an affordable travel solution? Our bus service partners offer
              comfortable and budget-friendly bus rides across cities and
              regions. You can book tickets in advance for a hassle-free
              journey.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <FaPlane className="text-3xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">
              Flight Tickets
            </h3>
            <p className="text-gray-600">
              For those looking to fly, we offer a range of flights from trusted
              airlines. Whether you're traveling for business or leisure, we
              help you find the best deals and most convenient flights to suit
              your schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Our Commitment
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          At TravelHub, we are committed to making your travel experience
          seamless, efficient, and enjoyable. Our platform is designed to help
          you compare, book, and manage your transportation with ease. We
          believe in delivering excellent customer service, competitive pricing,
          and secure transactions so that you can focus on enjoying your
          journey.
        </p>
      </section>

      {/* Contact Us Section */}
      <section className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Contact Us
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Have questions or need assistance? We're here to help! Feel free to
          reach out to us anytime via our customer support team. Your
          satisfaction is our top priority.
        </p>
        <div className="flex justify-center items-center mt-4">
          <FaPhoneAlt className="text-lg text-gray-600 mr-2" />
          <span className="text-base text-gray-600">Call us: 123-456-7890</span>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
