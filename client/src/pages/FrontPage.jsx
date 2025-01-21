/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { isMobile } from "react-device-detect";
import busImage from "../assets/bus.jpg";

const FrontPage = () => {
  // Check and remove "bookedTicket" token if it exists
  const bookedTicket = localStorage.getItem("bookedTicket");
  if (bookedTicket) {
    localStorage.removeItem("bookedTicket");
  }

  // Set up the images for the hero section
  const [bgImage, setBgImage] = useState(
    "https://images3.alphacoders.com/299/thumb-1920-29909.jpg"
  );

  useEffect(() => {
    // Set an interval to change the background every 5 seconds
    const imageInterval = setInterval(() => {
      setBgImage((prevImage) => {
        if (
          prevImage ===
          "https://images3.alphacoders.com/299/thumb-1920-29909.jpg"
        ) {
          return busImage; // Second image
        } else if (prevImage === busImage) {
          return "https://i.pinimg.com/originals/5a/dc/f1/5adcf19cdea4d0e737be886dfe19d6b9.jpg"; // Third image
        } else {
          return "https://images3.alphacoders.com/299/thumb-1920-29909.jpg"; // First image again
        }
      });
    }, 4000); // Change every 5 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(imageInterval);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{ ...styles.heroSection, backgroundImage: `url(${bgImage})` }}
      >
        <div style={styles.heroOverlay}></div> {/* Overlay */}
        <div style={styles.heroText}>
          <h1 style={styles.heroHeading}>Welcome to Horizon</h1>
          <p style={styles.heroSubHeading}>
            Easily book tickets for trains, buses, and flights securely through
            our trusted platform. Authorized by IRCTC and our esteemed partners
            to provide you with a seamless and reliable booking experience.
          </p>
          <Link to="/booking-dashboard" className="booking_btn">
            <span>Start Booking</span>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.aboutSection}>
        <div style={styles.container}>
          <div style={styles.aboutContent}>
            <h2 style={styles.aboutHeading}>About Us</h2>
            <p style={styles.aboutText}>
              We are a trusted platform offering a unified and convenient way to
              book tickets for your travel needs. Whether you&apos;re looking to
              book a train, bus, or flight, we&apos;ve got you covered.
              {!isMobile && (
                <>
                  Our goal is to provide a fast, secure, and easy way for
                  travelers to plan their journeys without hassle. With a
                  user-friendly interface and real-time availability updates,
                  booking tickets has never been easier. We are authorized by
                  IRCTC for train bookings and partnered with various bus and
                  flight service providers to ensure you get the best options
                  available.
                </>
              )}
            </p>
            {!isMobile && (
              <p style={styles.aboutText}>
                Our commitment to customer satisfaction and security sets us
                apart. Whether you&apos;re planning a short bus ride, a long
                train journey, or an international flight, we offer safe payment
                methods, secure bookings, and top-notch customer service
                throughout your journey.
              </p>
            )}
          </div>
          <div style={styles.imageContainer}>
            <img
              src="https://img.freepik.com/free-photo/online-ticket-booking_53876-74932.jpg?t=st=1734093903~exp=1734097503~hmac=d4fb2c11ff1315ec02667ed9bb7a407473908d8ac17c3c98f00d397bc8a30f43&w=1060"
              alt="Train Image"
              style={styles.image}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div className="flex flex-col items-center gap-3">
          <h2 style={styles.FeatureHeading}>Our Features</h2>

          <div
            className={`${
              isMobile
                ? "flex flex-col gap-2 justify-center items-center"
                : "flex flex-row gap-12 justify-center items-center"
            }`}
          >
            <div className="features_card">
              <div className="content flex flex-col p-3">
                <h3 style={styles.featureHeading}>Quick & Easy</h3>
                <p style={styles.featureText}>
                  Book tickets for trains, buses, and flights in just a few
                  clicks. Fast and hassle-free booking experience.
                </p>
              </div>
            </div>

            <div className="features_card">
              <div className="content flex flex-col p-3">
                <h3 style={styles.featureHeading}>Secure Payment</h3>
                <p style={styles.featureText}>
                  Enjoy safe and secure payment options for your convenience.
                  Your transactions are fully protected.
                </p>
              </div>
            </div>

            <div className="features_card">
              <div className="content flex flex-col p-3">
                {" "}
                <h3 style={styles.featureHeading}>Real-time Availability</h3>
                <p style={styles.featureText}>
                  Get real-time updates on availability for all modes of
                  transport and book with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section style={styles.carouselSection}>
        <h2 style={styles.carouselHeading}>Explore Our Services</h2>
        <Carousel
          autoPlay={true} // Enable auto play
          interval={2000} // Set the interval to 3 seconds (3000 milliseconds)
          infiniteLoop={true} // Enable infinite loop for the carousel
          showThumbs={false} // Hide thumbnails
          showStatus={false} // Hide the status
          transitionTime={500} // Set transition time for smooth effects
          stopOnHover={false} // Pause carousel on hover
        >
          <div style={styles.carouselItem}>
            <img
              src="https://img.freepik.com/free-vector/train-inside-with-seats-by-window_107791-30681.jpg?t=st=1734096792~exp=1734100392~hmac=0ca46665f2d867e335d8475b7ff0a2cba4f2ad82879921e321768aeadc20e081&w=1380"
              alt="Comfortable Seating"
              style={styles.carouselImage}
            />
          </div>
          <div style={styles.carouselItem}>
            <img
              src="https://img.freepik.com/free-vector/bus-stop-with-passengers-driver-inside_107791-15376.jpg?t=st=1734096766~exp=1734100366~hmac=96816067d0f1c1ab2a755aa275ee55aea204974548ce4b4839d50eb6609002fd&w=1380"
              alt="Convenient Bus Routes"
              style={styles.carouselImage}
            />
          </div>
          <div style={styles.carouselItem}>
            <img
              src="https://img.freepik.com/free-vector/queue-airport-check_102902-2354.jpg?t=st=1734096670~exp=1734100270~hmac=b81c218a1397352d71b28d0684bd105ba272505a924528f6b6d3b788b27f7ba4&w=1380"
              alt="Reliable Flights"
              style={styles.carouselImage}
            />
          </div>
        </Carousel>
      </section>

      {/* Call to Action Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaHeading}>Ready to Book Your Tickets?</h2>
          <p style={styles.ctaText}>
            Get started now and book your train, bus, and flight tickets at the
            best prices!
          </p>
          <Link to="/booking-dashboard" className="get_started_btn">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  heading: {
    fontSize: isMobile ? "1.3rem" : "30px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#076cb0", // Change the color here to your desired shade
  },
  FeatureHeading: {
    fontSize: isMobile ? "1.3rem" : "30px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "white", // Change the color here to your desired shade
  },

  heroSection: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    padding: "0 20px",
    position: "relative",
    backgroundImage: `url('https://images3.alphacoders.com/299/thumb-1920-29909.jpg')`, // Initial image
    height: isMobile ? "40vh" : "70vh",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Adjusted opacity of the overlay
    zIndex: 1,
  },
  heroText: {
    maxWidth: "700px",
    position: "relative",
    zIndex: "2",
  },
  heroHeading: {
    fontSize: isMobile ? "1.2rem" : "2.5rem",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
  },
  heroSubHeading: {
    fontSize: isMobile ? ".7rem" : "1rem",
    margin: "20px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  heroButton: {
    backgroundColor: "#3498DB",
    padding: isMobile ? "8px 16px" : "10px 20px", // Smaller padding for mobile
    fontSize: isMobile ? "0.9rem" : "1rem", // Smaller font size for mobile
    fontWeight: "600",
    textDecoration: "none",
    color: "#fff",
    borderRadius: "5px",
    display: "inline-block",
    transition: "background-color 0.3s",
    fontFamily: "'Poppins', sans-serif",
  },
  aboutSection: {
    padding: "60px 20px",
    height: isMobile ? "35vh" : "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(43, 58, 79)", // Darker background for professionalism
    paddingRight: isMobile ? "25px" : "50px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  aboutContent: {
    flex: "1",
    paddingRight: isMobile ? "0px" : "120px",
    paddingLeft: isMobile ? "0px" : "120px",
    fontFamily: "'Poppins', sans-serif",
  },
  aboutHeading: {
    fontSize: isMobile ? "1.2rem" : "2rem",
    fontWeight: "bold",
    color: "#3498DB",
  },
  aboutText: {
    fontSize: isMobile ? "0.55rem" : "1rem",
    color: "white",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  imageContainer: {
    flex: "1",
    marginLeft: isMobile ? "0px" : "20px",
  },
  image: {
    width: "100%",
    borderRadius: "8px",
    maxHeight: "400px",
    objectFit: "cover",
  },
  featuresSection: {
    padding: isMobile ? "30px 40px" : "60px 20px",
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font here
    paddingRight: isMobile ? "20px" : "120px",
    paddingLeft: isMobile ? "20px" : "120px",
    backgroundColor: "rgb(31, 41, 55)",
  },
  features: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: isMobile ? "15px" : "20px",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    padding: isMobile ? "20px" : "30px",
    width: isMobile ? "100%" : "30%",
    borderRadius: "12px", // Rounded corners
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)", // Add a light shadow to the cards
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth hover effect
    marginBottom: isMobile ? "20px" : "0", // Add margin for mobile cards
  },
  featureCardHover: {
    transform: "translateY(-5px)", // Slight lift effect
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.7)", // More pronounced shadow on hover
  },
  featureHeading: {
    fontSize: isMobile ? "1rem" : "1.3rem",
    fontWeight: "bold",
    color: "#3498DB",
    marginBottom: "10px",
    alignItems: isMobile ? "center" : "start",
  },
  featureText: {
    fontSize: isMobile ? "0.8rem" : "1rem",
    color: "gray",
    lineHeight: "1.6",
  },
  carouselSection: {
    padding: isMobile ? "30px 15px" : "60px 20px",
    backgroundColor: "rgb(43, 58, 79)", // Darker background for professionalism
    color: "#fff",
    textAlign: "center",
    paddingRight: isMobile ? "15px" : "120px",
    paddingLeft: isMobile ? "15px" : "120px",
  },
  carouselHeading: {
    fontSize: isMobile ? "1.5rem" : "2rem",
    fontWeight: "700",
    color: "#ecf0f1", // Soft white color
    fontFamily: "'Poppins', sans-serif", // Modern font style
    marginBottom: "20px",
  },
  carouselItem: {
    position: "relative", // Ensures that the carousel item takes up space
    display: "block", // Ensure that each item is block-level, avoiding overlap
  },
  carouselImage: {
    width: "100%",
    maxHeight: "400px",
    minHeight: isMobile ? "200px" : "0px",
    objectFit: "cover",
    borderRadius: "10px", // Rounded corners for a sleek look
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth effect for hover
  },
  ctaSection: {
    padding: isMobile ? "40px 20px" : "80px 20px",
    textAlign: "center",
    color: "#fff",
    backgroundColor: "rgb(43, 58, 79)",
  },
  ctaContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center", // Center content within container
  },
  ctaHeading: {
    fontSize: isMobile ? "1.3rem" : "1.7rem", // Adjust size for mobile
    fontWeight: "700",
    color: "#6ab4e6",
    marginBottom: "5px",
    fontFamily: "'Poppins', sans-serif", // Use Poppins font for consistency
  },
  ctaText: {
    fontSize: isMobile ? "0.8rem" : "1.2rem",
    color: "gray",
    marginBottom: "30px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600", // Lighter text for the description
  },
  ctaButton: {
    backgroundColor: "#fff",
    padding: isMobile ? "12px 25px" : "15px 30px", // Adjust padding for mobile
    fontSize: isMobile ? "1rem" : "1.2rem", // Adjust font size for mobile
    color: "#3498DB",
    borderRadius: "30px", // Pill shape for the button
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for the button
    transition: "background-color 0.3s ease, transform 0.3s ease", // Smooth transition for hover effects
  },
  ctaButtonHover: {
    backgroundColor: "#3498DB", // Change button background on hover
    color: "#fff", // Change text color on hover
    transform: "translateY(-5px)", // Slight lift effect on hover
  },
};

export default FrontPage;
