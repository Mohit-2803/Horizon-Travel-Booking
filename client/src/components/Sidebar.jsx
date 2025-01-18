/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrain,
  faDollarSign,
  faComments,
  faBus,
  faPlane,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ activeSection, onClick }) => {
  const sections = [
    { name: "Trains", key: "trains", icon: faTrain },
    { name: "Buses", key: "buses", icon: faBus },
    { name: "Flights", key: "flights", icon: faPlane },
    { name: "Revenue", key: "revenue", icon: faDollarSign },
    { name: "Queries", key: "queries", icon: faQuestionCircle },
    { name: "Comments", key: "comments", icon: faComments },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>
      <ul>
        {sections.map((section) => (
          <li
            key={section.key}
            className={`mb-4 p-2 rounded-lg cursor-pointer flex items-center space-x-4 ${
              activeSection === section.key
                ? "bg-blue-600"
                : "hover:bg-blue-700"
            }`}
            onClick={() => onClick(section.key)}
          >
            <FontAwesomeIcon icon={section.icon} className="text-xl" />
            <span>{section.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
