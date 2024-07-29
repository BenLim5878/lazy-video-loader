class LazyVideoLoader extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
        this.video = document.createElement('video')
        this.errorText = document.createElement('p')

        this.video.preload = "none"
        this.video.muted = true
        this.videoLoading = false
        this.sources = []

        this.errorText.innerText = "⚠️"

        this.shadowRoot.append(this.video)

        // Create a constructed stylesheet
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
            :host {
                display: flex;
                position: relative;
                width: auto;
                height: auto;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }

            video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
          `);

        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.mutationObserver = new MutationObserver(() => this.updateVideoSources());

        this.failedSources = 0
        this.totalSources = 0
    }

    connectedCallback() {
        // Setup Attributes for the video element
        let attrWidth = this.getAttribute('width')
        let attrHeight = this.getAttribute('height')
        let attrLoop = this.getAttribute('loop')
        let attrControls = this.getAttribute('controls')
        let attrPlaysinline = this.getAttribute('playsinline')
        let attrMargin = this.getAttribute('margin') || 0
        let attrManual = this.getAttribute('manual')
        let attrDisableRemotePlayback = this.getAttribute('disableRemotePlayback')

        if (attrDisableRemotePlayback === null) {
            this.video.disableRemotePlayback = false
        } else if (attrDisableRemotePlayback === "" || attrDisableRemotePlayback === "true") {
            this.video.disableRemotePlayback = true
        } else if (attrDisableRemotePlayback === "false") {
            this.video.disableRemotePlayback = false
        }   

        if (attrManual === null) {
            attrManual = false
        } else if (attrManual === "" || attrManual === "true") {
            attrManual = true
        } else if (attrManual === "false") {
            attrManual = false
        }   

        if (attrLoop === null) {
            this.video.loop = false;
        } else if (attrLoop === "" || attrLoop === "true") {
            this.video.loop = true;
        } else if (attrLoop === "false") {
            this.video.loop = false;
        }

        if (attrControls === null) {
            this.video.controls = false
        } else if (attrControls === "" || attrControls === "true") {
            this.video.controls = true
        } else if (attrControls === "false") {
            this.video.controls = false
        }

        if (attrPlaysinline === null) {
            this.video.playsInline = false;
        } else if (attrPlaysinline === "" || attrPlaysinline === "true") {
            this.video.playsInline = true;
        } else if (attrPlaysinline === "false") {
            this.video.playsInline = false;
        }

        if ((this.hasAttribute("width")) != (this.hasAttribute("height") == null)) {
            if (attrWidth == null) {
                this.video.height = attrHeight
                this.video.width = "auto"
            } else {
                this.video.width = attrWidth
                this.video.height = "auto"
            }
        }

        let widthHeightUnset = false

        if (!attrHeight && !attrWidth) {
            widthHeightUnset = true
        }

        // Calculate the rootMargin dynamically based on the container height
        const marginPercentage = attrMargin
        if (marginPercentage < 0) {
            marginPercentage = 0
        }
        const rootMargin = `${this.offsetHeight * marginPercentage}px 0px`;

        // Declare the observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.videoLoading && !attrManual) {
                        this.showThumbnail()
                        this.video.autoplay = true
                        this.load()
                    }
                }
            });
        }, { rootMargin: rootMargin });

        // Start the observer
        this.observer.observe(this);

        // Start the mutation observer
        this.mutationObserver.observe(this, { childList: true });

        this.video.addEventListener("loadedmetadata", () => {
            // Automatically setup the width and height of the video element based on the metadata
            if (widthHeightUnset) {
                this.video.width = this.video.videoWidth
                this.video.height = this.video.videoHeight
            }

            this.showThumbnail();
        })

        this.video.addEventListener("seeked", this.captureFirstFrame.bind(this));
    }

    disconnectedCallback() {
        this.mutationObserver.disconnect();
        this.video.pause();
        this.observer.disconnect();
    }

    async captureFirstFrame() {
        if (this.getAttribute('poster') == null) {
            if (this.video.readyState >= 2) { // Ensure video has enough data
                let canvas = document.createElement('canvas');
                canvas.width = this.video.videoWidth;
                canvas.height = this.video.videoHeight;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                this.video.poster = canvas.toDataURL(); // Set the captured frame as the poster
            }
        }
    }

    updateVideoSources() {
        const sources = Array.from(this.querySelectorAll('source'));
        sources.forEach(source => {
            this.totalSources++
            source.setAttribute('src', `${source.getAttribute('src')}`);
            const clonedSource = source.cloneNode(true)
            clonedSource.addEventListener("error", ()=>{
                this.failedSources++
                if (this.failedSources >= this.totalSources) {
                    this.shadowRoot.append(this.errorText)
                    this.video.remove()
                }
            })
            this.video.appendChild(clonedSource);
            this.sources.push(clonedSource)
            source.remove()
        });
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    load() {
        this.failedSources = 0
        this.videoLoading = true
        this.video.load();
    }

    showThumbnail() {
        let attrPoster = this.getAttribute('poster')

        if (attrPoster != null) {
            this.video.setAttribute('poster', this.getAttribute('poster'));
        }
    }


}

customElements.define('lazy-video-loader', LazyVideoLoader);