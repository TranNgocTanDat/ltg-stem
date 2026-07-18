export class AckManager {

    private queue: {
        resolve: () => void;
        reject: (e: Error) => void;
        timer: number;
    }[] = [];

    create(timeout = 3000) {

        return new Promise<void>((resolve, reject) => {

            const timer = window.setTimeout(() => {

                this.queue.shift();

                reject(new Error("ACK timeout"));

            }, timeout);

            this.queue.push({
                resolve,
                reject,
                timer,
            });

        });

    }

    ack() {

        const item = this.queue.shift();

        if (!item) return;

        clearTimeout(item.timer);

        item.resolve();

    }

}