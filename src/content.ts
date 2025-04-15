declare global {
    var browser: typeof chrome | undefined;
    // deno-lint-ignore no-explicit-any
    var chrome: any;
}

class YouTubeVideoController {
    private browser = globalThis.browser || globalThis.chrome;
    //to set only one event listener
    private attachedListeners = new Set<string>();

    constructor() {
        //Adds the event listeners
        this.observeYouTubeUpdates();
        

        // Initial execution
        setTimeout(() => {
            this.updateChannelName();
            this.pauseAtLastXSeconds();
        }, 1000);
    }

    private getChannelName(): string {
        const element = document.querySelector("ytd-channel-name yt-formatted-string") as HTMLElement;
        return element ? element.innerText.trim() : "Unknown";
    }
    //sends the channel name to update the popup
    private updateChannelName() {
        const channelName = this.getChannelName();
        console.log("Detected channel name:", channelName);

        if (this.browser.runtime?.sendMessage) {
            this.browser.runtime.sendMessage({
                type: "CHANNEL_NAME",
                channelName,
            });
        } else {
            console.error("browser.runtime.sendMessage is not available.");
        }
    }

    
    private async pauseAtLastXSeconds() {
                const video = document.querySelector("video") as HTMLVideoElement;
                if (!video) return;

                const channelName = this.getChannelName();
                const key = `${video.currentSrc}`;

                if (this.attachedListeners.has(key)) return;

                const pauseOffset = await this.getPauseOffset(channelName);
                console.log("pause offset",pauseOffset)
                if (pauseOffset === null) return;

                this.attachedListeners.add(key);
                this.attachPauseListeners(video, pauseOffset, key);
    }


    private attachPauseListeners(video: HTMLVideoElement, pauseOffset: number, key: string) {
        let alreadyPaused = false;
        const checkPauseTime = (event: Event) => {
            const inRestrictedZone = video.duration && video.currentTime >= video.duration - pauseOffset;
            console.log("alreadpaused",alreadyPaused)
            if (alreadyPaused) return;
            //If it reached the offset zone pause the video
            if (inRestrictedZone) {
                console.log(`Pausing video ${pauseOffset} seconds before end triggered by`, event.type);
                video.pause();
                alreadyPaused = true;
            }
        };
    
        const removePauseEvent = () => {
            const inRestrictedZone = video.duration && video.currentTime >= video.duration - pauseOffset;
            if (inRestrictedZone) {
                console.log("User resumed in restricted zone, removing restrictions.");
                video.removeEventListener("timeupdate", checkPauseTime);
                video.removeEventListener("play", removePauseEvent);
                this.attachedListeners.delete(key);
            }
        };
    
        console.log("Adding timeupdate & play listeners on", key);
        video.addEventListener("timeupdate", checkPauseTime);
        video.addEventListener("play", removePauseEvent);
    }
    

    private async getPauseOffset(channelName: string): Promise<number | null> {
        const result = await this.browser.storage.local.get(channelName);
        const value = result[channelName];
        console.log("offset",value)
        return !isNaN(value) ? value : null;
    }
    
    
    private observeYouTubeUpdates() {
        document.addEventListener("yt-page-data-updated", () => {
            console.log("YouTube page updated, fetching new data...");
            setTimeout(() => {
                this.updateChannelName();
                this.pauseAtLastXSeconds();
            }, 1000);
        });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                console.log("Tab became active, checking for updates...");
                setTimeout(() => {
                    this.updateChannelName();
                    this.pauseAtLastXSeconds();
                }, 1000);
            }
        });
    }
}

// Immediately instantiate to start logic
new YouTubeVideoController();
