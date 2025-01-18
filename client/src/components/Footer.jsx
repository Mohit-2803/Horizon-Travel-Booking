/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa"; // Import FontAwesome Icons
import { isMobile } from "react-device-detect";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h3 style={styles.AboutHeading}>About Us</h3>
          <p style={styles.AboutText}>
            We are a professional train ticket booking platform, authorised by
            IRCTC, making your travel experience seamless.
          </p>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Contact</h3>
          <div style={styles.row}>
            <FaEnvelope className="footer-icon-envelope" />
            <p style={styles.text}>support@trainbookings.com</p>
          </div>
          <div style={styles.row}>
            <FaPhoneAlt className="footer-icon-phone" />
            <p style={styles.text}>+91 123 456 7890</p>
          </div>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Follow Us</h3>
          <div style={styles.row}>
            <FaFacebook className="footer-icon-facebook" />
            <a
              href="https://www.facebook.com"
              style={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
          <div style={styles.row}>
            <FaTwitter className="footer-icon-twitter" />
            <a
              href="https://twitter.com"
              style={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
          <div style={styles.row}>
            <FaInstagram className="footer-icon-instagram" />
            <a
              href="https://www.instagram.com"
              style={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Quick Links</h3>
          <div style={styles.row}>
            <FaInfoCircle className="footer-icon-info" />
            <a href="/terms" style={styles.quickLink}>
              Terms of Service
            </a>
          </div>
          <div style={styles.row}>
            <FaLock className="footer-icon-lock" />
            <a href="/privacy" style={styles.quickLink}>
              Privacy Policy
            </a>
          </div>
          <div style={styles.row}>
            <FaInfoCircle className="footer-icon-faq" />
            <a href="/faq" style={styles.quickLink}>
              FAQ
            </a>
          </div>
        </div>
      </div>
      <div style={styles.bottomBar}>
        <p style={styles.copyRight}>© 2025 Horizon. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: isMobile ? "20px 40px" : "40px 50px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  column: {
    flex: "1",
    minWidth: "200px",
    marginBottom: "20px",
  },
  AboutHeading: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  heading: {
    fontSize: isMobile ? "15px" : "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    alignItems: "center", // Align icon and text vertically
    marginBottom: isMobile ? "5px" : "10px", // Space between rows
  },

  AboutText: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  text: {
    fontSize: isMobile ? "13px" : "15px",
    lineHeight: "1.6",
    marginLeft: "10px", // Space between icon and text
  },
  icon: {
    marginRight: "10px",
  },
  "footer-icon-envelope": {
    color: "#3498DB",
  },
  "footer-icon-phone": {
    color: "#2ECC71",
  },
  "footer-icon-facebook": {
    color: "#3B5998",
  },
  "footer-icon-twitter": {
    color: "#1DA1F2",
  },
  "footer-icon-instagram": {
    color: "#E1306C",
  },
  "footer-icon-info": {
    color: "#F39C12",
  },
  "footer-icon-lock": {
    color: "#E74C3C",
  },
  "footer-icon-faq": {
    color: "#9B59B6",
  },
  socialLink: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "10px", // Space between icon and text
    transition: "color 0.3s ease",
    fontSize: isMobile ? "13px" : "15px",
  },
  socialLinkHover: {
    color: "#3498DB",
  },
  quickLink: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "10px", // Space between icon and text
    transition: "color 0.3s ease",
    fontSize: isMobile ? "13px" : "15px",
  },
  quickLinkHover: {
    color: "#3498DB",
  },
  bottomBar: {
    textAlign: "center",
    paddingTop: isMobile ? "10px" : "20px",
    borderTop: "1px solid #34495E",
  },
  copyRight: {
    fontSize: isMobile ? "9px" : "14px",
    color: "#BDC3C7",
  },
};

export default Footer;
