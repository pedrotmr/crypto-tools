import React, { useState, useEffect } from "react";
import { BsFillMoonFill, BsFillSunFill, BsFillHouseDoorFill } from "react-icons/bs";
import { IoMdWallet } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type NavBarProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

type NavItem = "Home" | "Wallet";

const sharedStyles = {
  toggleButton: "text-xl px-8",
  navItem: "flex justify-center items-center gap-2 p-4",
  activeNavItem: "border-b-4 border-[#00ab58] dark:border-[#00e776]",
};

const NavBar: React.FC<NavBarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [selected, setSelected] = useState<NavItem>("Home");
  const [isOnChartScreen, setIsOnChartScreen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/coins")) {
      setIsOnChartScreen(true);
    } else {
      setIsOnChartScreen(false);
    }

    if (location.pathname.startsWith("/wallet")) {
      setSelected("Wallet");
    }
  }, [location]);

  return (
    <div className='flex justify-between items-center'>
      {isOnChartScreen ? (
        <button className={`${sharedStyles.navItem}`} onClick={() => navigate(-1)}>
          <FaArrowLeft /> <span>Back</span>
        </button>
      ) : (
        <>
          <span className={`${sharedStyles.toggleButton} hidden md:flex`}></span>
          <nav className='flex justify-center gap-4 ml-6'>
            <Link
              to='/'
              className={`${sharedStyles.navItem} ${
                selected === "Home" && sharedStyles.activeNavItem
              }`}
              onClick={() => setSelected("Home")}>
              <BsFillHouseDoorFill /> <span>Home</span>
            </Link>
            <Link
              to='wallet'
              className={`${sharedStyles.navItem} ${
                selected === "Wallet" && sharedStyles.activeNavItem
              }`}
              onClick={() => setSelected("Wallet")}>
              <IoMdWallet /> <span>Wallet</span>
            </Link>
          </nav>
        </>
      )}

      <button
        aria-label='toggle dark mode'
        className={sharedStyles.toggleButton}
        onClick={toggleDarkMode}>
        {isDarkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
      </button>
    </div>
  );
};

export default NavBar;
