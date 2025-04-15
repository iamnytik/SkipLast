import React, { useState } from "react";
import HeartIcon from "./heart.tsx";
import SettingsIcon from "./settings.tsx";
interface TimestampFormProps {
  time: string;
  setTime: (value: string) => void;
  handleSave: () => void;
}

const TimestampForm: React.FC<TimestampFormProps> = ({ time, setTime, handleSave }) => {
  const [error, setError] = useState("");

  const validateInput = (input: string) => {
    if (/^\d*$/.test(input)) {
      setError("");
      setTime(input);
    } else {
      setError("Enter a valid number of seconds");
    }
  };

  return (
    <>
      <SettingsIcon className="absolute top-2 left-2"  url="./options.html"  ></SettingsIcon>
      <a>

      </a>
      <HeartIcon className="absolute top-2 right-2"  url="https://example.com"  / >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[300px] dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Set Time</h2>
        </div>
        <form className="max-w-sm mx-auto">
          <label
            htmlFor="time-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Enter seconds:
          </label>
          <input
            type="text"
            id="time-input"
            value={time}
            onChange={(e) => validateInput(e.target.value.trim())}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter seconds"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </form>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 w-[250px] text-white bg-blue-700 hover:bg-blue-800 
                     focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium 
                     rounded-full text-sm px-5 py-2.5 text-center 
                     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={!!error || time.trim() === ""}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default TimestampForm;
