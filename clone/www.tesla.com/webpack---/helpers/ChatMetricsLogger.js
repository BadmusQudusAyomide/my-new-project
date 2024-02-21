import axios from 'axios';
import {
    sendDebugMessage
} from '../utils/AvayaChatUtils';

class ChatMetricsLogger {
    static# instance;

    #
    logPrefix = '[CUA-CHAT-UI] [Metrics] ';#
    metrics = {};#
    timer;#
    timeDelayMin = 5000;

    constructor(timerDelay = 10000) {
        if (ChatMetricsLogger.#instance) {
            return ChatMetricsLogger.#instance;
        }

        this.startLogTimer(timerDelay);

        ChatMetricsLogger.#instance = this;
    }

    addWorkerId(value) {
        this.#metrics.wid = value || '';
    }

    addMetric(metricName, metricValue) {
        if (metricName in this.#metrics) {
            this.#metrics[metricName].push(metricValue);
        } else {
            this.#metrics[metricName] = [metricValue];
        }
    }

    flush() {
        if (!this.#metrics || Object.keys(this.#metrics).length === 0) {
            sendDebugMessage(this.#logPrefix + 'Nothing to send.');

            return;
        }

        axios.post('/conversation/m', this.#metrics).catch(() => {
            // If error do nothing
        });

        sendDebugMessage(this.#logPrefix + 'Log records', this.#metrics);
        this.#metrics = {};
    }

    startLogTimer(timerDelay) {
        if (!typeof this.#timer === undefined) {
            this.stopLogTimer();
        }

        if (timerDelay < this.#timeDelayMin) {
            sendDebugMessage(
                this.#logPrefix +
                "Can't start sending logs that often due to impact on performance. " +
                'Consider setting the timer delay value to over 1000 seconds.'
            );
            return;
        }

        this.#timer = setInterval(this.flush.bind(this), timerDelay);
    }

    stopLogTimer() {
        if (typeof this.#timer === undefined) {
            return;
        }

        clearInterval(this.#timer);
    }
}

export default ChatMetricsLogger;