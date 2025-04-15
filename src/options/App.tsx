
import { useEffect, useRef, useState } from "react";
import browser from "webextension-polyfill";

const App = () => {
  const [jsonData, setJsonData] = useState<string>("");
  const [initialData, setInitialData] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    (async () => {
      const allData = await browser.storage.local.get(null);
      delete allData.currentChannel;
      const formatted = JSON.stringify(allData, null, 2);
      setJsonData(formatted);
      setInitialData(formatted);
    })();
  }, []);

  const hasChanged = jsonData !== initialData;

  return (
    <div className="min-h-screen w-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white p-6 flex flex-col gap-y-6">
      {/* Button Group */}
      <div className="flex gap-x-2">
        <button
          id="save"
          type="button"
          disabled={!hasChanged}
          className={`px-4 py-2 text-sm font-medium border rounded-s-lg focus:z-10 focus:ring-2
            ${
              hasChanged
                ? "text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500"
                : "text-gray-400 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            }`}
          onClick={() => {
            if (!hasChanged) return;

            try {
              const parsedData = JSON.parse(jsonData); // Validate & parse JSON
              browser.storage.local.set(parsedData).then(() => {
                console.log("Saved successfully");
                setInitialData(jsonData); // Reset initialData so Save button gets disabled again
              });
            } catch (err) {
              console.error("Invalid JSON:", err);
              alert("The JSON is invalid. Please fix it before saving.");
            }
          }}
        >
          Save
        </button>

        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => {
            console.log("Imported")
            fileInputRef.current?.click(); 


          }}
        >
          Import
        </button>

        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => {
            console.log("Exported")
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "data-export.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
           }}
        >
          Export
        
        </button>
      </div>

      <textarea
        className="w-full h-[300px] p-4 font-mono bg-gray-100 dark:bg-gray-800 text-sm resize-none rounded-lg border border-gray-300 dark:border-gray-700"
        value={jsonData}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setJsonData(e.target.value)}
      />

<input
  type="file"
  accept="application/json"
  ref={fileInputRef}
  className="hidden"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text); // Throws if invalid
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonData(formatted);
      setInitialData(formatted); // Optional: treat as "clean"
      console.log("Imported JSON:", parsed);
    } catch (err) {
      alert("Failed to import JSON. Is the file valid?");
      console.error(err);
    }

    // Reset input so user can re-upload the same file if needed
    e.target.value = "";
  }}
/>
    </div>
  );
};

export default App;