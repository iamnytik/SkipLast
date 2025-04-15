import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import TimestampForm from "../components/TimestampForm.tsx";

function App() {
  const [time, setTime] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("Loading...");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    async function fetchChannelName() {
      const storageData = await browser.storage.local.get("currentChannel");//this is the object
      const currentChannel = storageData.currentChannel || "Unknown";
      setChannelName(currentChannel);
      const saved = await browser.storage.local.get(currentChannel);
      if (saved[currentChannel]) {
        setTime(saved[currentChannel].toString()); // Set the time as string for input field
      }
    }
    

    

    fetchChannelName();

    // Listen for channel updates
    const listener = (message: {type:string ,channelName:string}) => {
      if (message.type === "UPDATE_POPUP") {
        setChannelName(message.channelName);
      }
    };

    browser.runtime.onMessage.addListener(listener);

    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const savePauseTime = async () => {
    const parsedTime = Number(time.trim()); // Convert input text to a number
  
    if (!isNaN(parsedTime) && parsedTime > 0) {

      await browser.storage.local.set({ [channelName]: parsedTime });
      setStatus(`Saved: ${channelName} pauses at ${parsedTime}s`);
    } else {
      setStatus("Enter a valid number!");
    }
  };
  

  return (
    <div className="w-[340px] h-[450px] flex flex-col items-center justify-center 
                    bg-gray-200 dark:bg-gray-900 p-6 text-gray-900 dark:text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">YouTube Channel</h2>
      <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
        <strong>{channelName}</strong>
      </p>
      
      <TimestampForm time={time} setTime={setTime} handleSave={savePauseTime} />

      {status && (
        <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
          {status}
        </p>
      )}
    </div>
  );
}

export default App;
