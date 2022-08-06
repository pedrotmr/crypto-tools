import React from "react";

const TableSkeleton = () => {
  return (
    <div className='overflow-x-auto rounded-xl'>
      <table className='w-full h-[70px]'>
        <thead className='bg-gray-300 dark:bg-gray-600'>
          <tr>
            {Array(9)
              .fill(null)
              .map((_, idx) => (
                <th key={idx}>
                  <div className='h-9 '></div>
                </th>
              ))}
          </tr>
        </thead>

        <tbody className='bg-gray-100 dark:bg-gray-800  dark:border-gray-700'>
          {Array(10)
            .fill(Array(9).fill(null))
            .map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className='hover:bg-gray-200 dark:hover:bg-gray-700 p-4 transition-colors ease-out '>
                {row.map((_: any, colIdx: number) => (
                  <td key={colIdx} className='h-[calc(70vh/10)] first:w-14 '>
                    <div className='my-4 mx-3 h-5  rounded-lg bg-gray-400 dark:bg-gray-700 animate-pulse'></div>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
