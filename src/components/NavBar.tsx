import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  IoIosSend,
  IoIosSwap,
  IoMdWallet,
  IoMdTrendingUp,
  IoIosSunny,
  IoIosMoon,
  IoMdArrowBack,
} from "react-icons/io";

type NavBarProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

type NavBarItemsType = {
  path: string;
  name: "Trending" | "Wallet" | "Send" | "Swap";
  icon: React.ReactNode;
};

type NavItem = "Trending" | "Wallet" | "Send" | "Swap";

const sharedStyles = {
  toggleButton: "text-xl px-8",
  navItem: "flex justify-center items-center gap-2 p-4",
  activeNavItem: "border-b-4 border-[#00ab58] dark:border-[#00e776]",
};

const NavBar: React.FC<NavBarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [selected, setSelected] = useState<NavItem>("Trending");
  const [isOnChartScreen, setIsOnChartScreen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navBarItems: NavBarItemsType[] = [
    {
      path: "/",
      name: "Trending",
      icon: <IoMdTrendingUp />,
    },
    {
      path: "wallet",
      name: "Wallet",
      icon: <IoMdWallet />,
    },
    {
      path: "send",
      name: "Send",
      icon: <IoIosSend />,
    },
    {
      path: "swap",
      name: "Swap",
      icon: <IoIosSwap />,
    },
  ];

  useEffect(() => {
    if (location.pathname.startsWith("/coins")) {
      setIsOnChartScreen(true);
    } else {
      setIsOnChartScreen(false);
    }
  }, [location]);

  return (
    <div className='flex justify-between items-center'>
      {isOnChartScreen ? (
        <button className={`${sharedStyles.navItem}`} onClick={() => navigate(-1)}>
          <IoMdArrowBack /> <span>Back</span>
        </button>
      ) : (
        <>
          <span className={`${sharedStyles.toggleButton} hidden lg:flex`}></span>
          <nav className='flex justify-center gap-4 ml-6'>
            {navBarItems.map((item, idx) => (
              <Link
                to={item.path}
                key={idx}
                className={`${sharedStyles.navItem} ${
                  selected === item.name && sharedStyles.activeNavItem
                }`}
                onClick={() => setSelected(item.name)}>
                {item.icon} <span className='hidden md:flex'>{item.name}</span>
              </Link>
            ))}
          </nav>
        </>
      )}

      <button
        aria-label='toggle dark mode'
        className={sharedStyles.toggleButton}
        onClick={toggleDarkMode}>
        {isDarkMode ? <IoIosSunny /> : <IoIosMoon />}
      </button>
    </div>
  );
};

export default NavBar;
