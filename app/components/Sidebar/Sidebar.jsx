"use client"; // Mark this file as a client component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "../../utils/logout";

function Sidebar() {
  const [open, setOpen] = useState(true);

  // Active menu state
  const [activeMenu, setActiveMenu] = useState("");

  // Load saved sidebar state + active menu on page load
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }

    const savedActive = localStorage.getItem("activeMenu");
    if (savedActive) {
      setActiveMenu(savedActive);
    }
  }, []);

  // Toggle sidebar and save
  const toggleSidebar = () => {
    setOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
      return newState;
    });
  };

  // Menu items list
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", image: "/User.png" },
    { name: "User Management", path: "/userManagement", image: "/User.png" },
    { name: "Gifts Management", path: "/giftsManagement", image: "/User.png" },
    { name: "Chat Reports", path: "/chatReport", image: "/Calendar.png" },
    { name: "Coin Management", path: "/coinManagement", image: "/Chart.png" },
    {
      name: "Content Management",
      path: "/contentManagement",
      image: "/Chart.png",
    },
    {
      name: "Revenue Analytics",
      path: "/revenueAnalytics",
      image: "/Chart.png",
    },
    {
      name: "create room",
      path: "/createRoom",
      image: "/Chart.png",
    },
    { name: "Settings", path: "/setting", image: "/Folder.png" },
    // { name: "Logout", path: "/logout", image: "/Setting.png" },
  ];

  // Handle click and store active menu
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    localStorage.setItem("activeMenu", menuName);
  };

  return (
    <div className="bg-gray-100">
      <div className="hidden lg:block shadow bg-white rounded-md border border-gray-200">
        <div
          className={`${
            open ? "w-80" : "w-20"
          } bg-dark-purple h-screen p-3 pt-8 relative duration-300`}
        >
          {/* Toggle */}
          <Image
            src="/control.png"
            width={200}
            height={100}
            className={`absolute cursor-pointer -right-3 top-11 w-7 border-dark-purple rounded-full ${
              !open && "rotate-180"
            }`}
            onClick={toggleSidebar}
            alt="toggle"
          />

          {/* Logo */}
          <div className="flex gap-x-4 items-center">
            <Image
              src="/Dil (2).png"
              width={200}
              height={200}
              className={`cursor-pointer duration-300 w-20 ${
                open && "rotate-[360deg]"
              }`}
              alt="logo"
            />
            <h1
              className={`text-customBlue origin-left font-bold text-2xl duration-200 ${
                !open && "scale-0"
              }`}
            >
              Dil
            </h1>
          </div>

          {/* Menu List */}
          <ul className="pt-6">
            {menuItems.map((menu, index) => (
              <li
                key={index}
                className={`flex rounded-md p-2 m-2 cursor-pointer items-center gap-x-4 text-lg font-medium
                 duration-200
                ${
                  activeMenu === menu.name
                    ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                    : "text-customBlue hover:bg-blue-50 hover:text-blue-500"
                }`}
              >
                <Link
                  href={menu.path}
                  onClick={() => handleMenuClick(menu.name)}
                  className="flex items-center gap-x-4 w-full"
                >
                  <Image
                    src={menu.image}
                    width={25}
                    height={25}
                    alt={menu.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menu.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Logout */}
          <div
            onClick={logout}
            className="mt-auto flex cursor-pointer items-center gap-x-4 rounded-md p-2 m-2
             text-lg font-medium text-red-600 hover:bg-red-50"
          >
            <Image src="/Setting.png" width={25} height={25} alt="Logout" />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
