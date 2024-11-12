class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;
    private concurrentLimit = 3;
    private activeRequests = 0;

    async add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing || this.activeRequests >= this.concurrentLimit) {
            return;
        }

        this.processing = true;
        while (this.queue.length && this.activeRequests < this.concurrentLimit) {
            const request = this.queue.shift();
            if (request) {
                this.activeRequests++;
                try {
                    await request();
                } finally {
                    this.activeRequests--;
                }
            }
        }
        this.processing = false;
    }
}

export const requestQueue = new RequestQueue(); 