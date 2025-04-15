import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener((message:{ type: string; channelName: string; }, _sender:browser.runtime.MessageSender) => {
    if (message.type === "CHANNEL_NAME") {
        console.log("Received channel name:", message.channelName);
        browser.storage.local.set({ "currentChannel": message.channelName });
        

        // Send the channel name to all popups
        browser.runtime.sendMessage({
            type: "UPDATE_POPUP",
            channelName: message.channelName,
        });
    }
});
