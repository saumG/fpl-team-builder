import React, { useEffect, useRef, useState } from "react";

type Props = {
  placeholder: string;
  data: any;
};

function SearchBar({ placeholder, data }: Props) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntry, setWordEntry] = useState("");

  const handleFilter = (event: any) => {
    const searchWord = event.target.value.toLowerCase();
    setWordEntry(searchWord);
    const newFilter = data.filter((value: any) => {
      const fullName = (
        value.first_name +
        " " +
        value.second_name
      ).toLowerCase();
      return fullName.includes(searchWord);
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntry("");
  };

  return (
    <div className="search">
      <div className="search-inputs flex border-2 justify-between">
        <input
          className="bg-white rounded text-base p-2 h-6 w-96 border-none"
          type="text"
          placeholder={placeholder}
          onChange={handleFilter}
          value={wordEntry}
        ></input>
        <div className="search-icon h-6 w-12 bg-white grid place-items-center focus:outline-none">
          {filteredData.length == 0 ? (
            <img className="h-5" src="/search-52.svg" alt="" />
          ) : (
            <img
              className="h-5 cursor-pointer"
              src="/icons8-close.svg"
              alt=""
              onClick={clearInput}
            />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="search-result mt-[5px] w-96  bg-white shadow-[rgba(0,0,0,0.35) 0px 5px 15px] overflow-hidden overflow-y-auto">
          {filteredData.slice(0, 15).map((value: any, key: any) => {
            return (
              <div className="flex justify-between w-96 max-h-16">
                <a className="data-item player flex items-center text-black ml-2 hover:bg-gray-200">
                  {value.first_name + " " + value.second_name}
                </a>
                <img
                  className="h-5 cursor-pointer"
                  src="/icons8-plus.svg"
                  alt=""
                  onClick={() => {
                    clearInput();
                  }}
                  //   instead of clearing input, add to team and clear input.
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
