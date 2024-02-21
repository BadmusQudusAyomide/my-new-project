class LinkHelper {
    constructor(config) {
        /**
         * Set to <em>true</em> to use secure connections across the board.
         */
        this.secureAllConnections = false;

        // /**
        //  * The hostname or cluster of the OCP cluster
        //  */
        // this.webChatHost = config.oceanaWebChatHost;

        /**
         * The hostname or cluster of the OCP cluster
         */
        this.secureSocket = config.oceanaWebChatSocket;
    }

    /**
     * Set up secure URLs. This will enforce HTTPS/WSS if the site itself is served over HTTPS. Call on page load.
     */
    setupSecurity() {
        if (window.location.protocol === 'https:') {
            this.secureAllConnections = true;
        }
    }

    /**
     * Return the URL for the WebSocket.
     * @return {String} the WebSocket URL.
     */
    getWebChatUrl() {
        return this.secureSocket;
    }

    // /**
    //  * Returns the URL for the file transfer.
    //  * @param {String} fileUuid - identifies the attachment
    //  * @param {String} workRequestId - identifies the contact in Oceana
    //  * @return {String}
    //  */
    // getFileDownloadUrl(fileUuid, workRequestId) {
    //   return `${
    //     (this.secureAllConnections ? 'https://' : 'http://') + this.webChatHost
    //   }/services/customer/rest/attachment/${fileUuid}?workRequestId=${workRequestId}`;
    // }
}

export default LinkHelper;