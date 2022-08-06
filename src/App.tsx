import React, { useState } from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return !localStorage.theme || localStorage.theme === "dark";
  });

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
    localStorage.theme = isDarkMode ? "light" : "dark";
  };

  const toastProps: ToastContainerProps = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: false,
    pauseOnHover: false,
    newestOnTop: true,
    theme: isDarkMode ? "dark" : "light",
    style: { width: "max-content" },
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className='p-2 min-h-screen dark:text-light bg-light dark:bg-dark'>
        <div className='md:w-[85vw] max-w-screen-2xl mx-auto'>
          <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Outlet context={isDarkMode} />
          <ToastContainer {...toastProps} />
        </div>
      </div>
    </div>
  );
};

export default App;
