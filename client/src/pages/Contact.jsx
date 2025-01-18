import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaComment,
  FaUser,
  FaStickyNote,
} from "react-icons/fa";
import { isMobile } from "react-device-detect"; // Import isMobile

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-10">
      {/* Hero Section */}
      <section
        className={`${
          isMobile
            ? "text-center bg-blue-600 text-white py-4 rounded-lg"
            : "text-center bg-blue-600 text-white py-12 rounded-lg"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Contact Us</h1>
        <p className="text-lg sm:text-xl">
          We would love to hear from you. Please feel free to reach out.
        </p>
      </section>

      {/* Contact Form Section */}
      <section
        className={`${
          isMobile ? "space-y-8 max-w-96 m-auto" : "space-y-8 min-w-96 m-auto"
        }`}
      >
        <form
          className={`grid ${
            isMobile ? "grid-cols-1 gap-5" : "grid-cols-2 gap-6 w-full"
          } p-8 bg-white shadow-xl rounded-lg`}
        >
          {/* Left Side */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg text-gray-800 font-semibold mb-2"
            >
              Name
            </label>
            <div className="relative items-center">
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600 shadow-md"
                required
              />
              <FaUser className="absolute left-4 top-6 text-gray-500" />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-lg text-gray-800 font-semibold mb-2"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600 shadow-md"
                required
              />
              <FaEnvelope className="absolute left-4 top-6 text-gray-500" />
            </div>
          </div>

          {/* Right Side */}
          <div>
            <label
              htmlFor="phone"
              className="block text-lg text-gray-800 font-semibold mb-2"
            >
              Phone
            </label>
            <div className="relative">
              <input
                type="text"
                id="phone"
                placeholder="Your Phone"
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600 shadow-md"
                required
              />
              <FaPhoneAlt className="absolute left-4 top-6 text-gray-500" />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-lg text-gray-800 font-semibold mb-2"
            >
              Subject
            </label>
            <div className="relative">
              <input
                type="text"
                id="subject"
                placeholder="Subject"
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600 shadow-md"
                required
              />
              <FaStickyNote className="absolute left-4 top-6 text-gray-500" />
            </div>
          </div>

          {/* Message Box */}
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-lg text-gray-800 font-semibold mb-2"
            >
              Message
            </label>
            <div className="relative">
              <textarea
                id="message"
                placeholder="Your Message"
                rows="6"
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600 shadow-md resize-none"
                required
              />
              <FaComment className="absolute left-4 top-6 text-gray-500" />
            </div>
          </div>
          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none shadow-lg"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Contact Details Section */}
      <section className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
          Our Contact Information
        </h2>
        <div
          className={`flex ${
            isMobile ? "flex-col" : "justify-center space-x-8"
          } mt-6`}
        >
          <div className="text-center mb-6 sm:mb-0">
            <FaPhoneAlt className="text-3xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
            <p className="text-gray-600">123-456-7890</p>
          </div>
          <div className="text-center mb-6 sm:mb-0">
            <FaEnvelope className="text-3xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="text-gray-600">support@travelhub.com</p>
          </div>
          <div className="text-center">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800">Location</h3>
            <p className="text-gray-600">123 Travel Street, City, Country</p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Follow Us
        </h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-blue-600 hover:text-blue-700"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-blue-600 hover:text-blue-700"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-blue-600 hover:text-blue-700"
          >
            <FaTwitter />
          </a>
        </div>
      </section>

      {/* Map Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
          Find Us On The Map
        </h2>
        <div className="w-full h-64 mt-6 bg-gray-200 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.6429560219735!2d-122.08424968468124!3d37.42199927982574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb72bca12b5cd%3A0x1b6020eabeb8f93!2sGoogleplex!5e0!3m2!1sen!2sus!4v1671423849381!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
