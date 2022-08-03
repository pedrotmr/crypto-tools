import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTokenContext } from "../context/TokenContext";

const sharedStyles = {
  highlightedText: "font-semibold text-gray-900 dark:text-white",
  footerButton:
    "py-2 px-4 text-sm text-gray-500 bg-white inline-flex items-center border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
};

const FooterButtons: React.FC = () => {
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const perPageOptions = [10, 25, 50, 100];

  const { trendingTokens, pagination, getNextPage, getPreviousPage, getTokenPage } =
    useTokenContext();

  const hanflePageDropdownClick = (perPage: number) => {
    getTokenPage(perPage);
    setPageDropdownOpen(false);
  };

  return (
    <div className='flex w-full px-2 mt-6 justify-between'>
      <div className='hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400'>
        <span>
          Showing <span className={sharedStyles.highlightedText}>{trendingTokens[0]?.id}</span> to{" "}
          <span className={sharedStyles.highlightedText}>{trendingTokens.at(-1)?.id}</span> out of{" "}
          <span className={sharedStyles.highlightedText}>6250</span>
        </span>
      </div>

      <div className='flex mr-8'>
        <button
          className={`${sharedStyles.footerButton} rounded-l`}
          onClick={() => getPreviousPage()}>
          Prev
        </button>
        <button className={`${sharedStyles.footerButton} rounded-r`} onClick={() => getNextPage()}>
          Next
        </button>
      </div>

      <div className='relative'>
        <span className='text-sm text-gray-500 dark:text-gray-400 mr-2'>Show rows</span>
        <button
          className={`${sharedStyles.footerButton} rounded-lg`}
          onClick={() => setPageDropdownOpen(!pageDropdownOpen)}>
          {pagination.perPage}
          {pageDropdownOpen ? <FaChevronDown className='ml-2' /> : <FaChevronUp className='ml-2' />}
        </button>

        {pageDropdownOpen && (
          <div className='z-10 absolute bg-white bottom-12 right-0 rounded shadow-2xl dark:bg-gray-700'>
            <div className='py-1 text-sm text-gray-700 dark:text-gray-200'>
              {perPageOptions
                .filter((perPage) => perPage !== pagination.perPage)
                .map((num, idx) => (
                  <button
                    key={idx}
                    className='flex flex-col items-end w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                    onClick={() => {
                      hanflePageDropdownClick(num);
                    }}>
                    {num}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterButtons;
