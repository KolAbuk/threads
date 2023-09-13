"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Threads = void 0;
class Threads {
    constructor(threadFunc, logFunc, threadsCount, timeout) {
        this.threads = [];
        this.trueCounter = 0;
        this.falseCounter = 0;
        this.startedCounter = 0;
        this.getTrueCounter = () => this.trueCounter;
        this.getFalseCounter = () => this.falseCounter;
        this.getAllCounter = () => this.trueCounter + this.falseCounter;
        this.run = (numOfStarts, ...data) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (numOfStarts < 1) {
                    throw new Error("Times  must be >=1");
                }
                const timeout = (workerID) => __awaiter(this, void 0, void 0, function* () {
                    yield new Promise((res) => setTimeout(res, this.timeout));
                    return {
                        workerID,
                        success: false,
                        logText: "TIMEOUT",
                    };
                });
                for (let i = 0; i < this.threadsCount; i++) {
                    this.threads[i] = Promise.race([
                        this.threadFunc({
                            workerID: i,
                            startedCounter: this.startedCounter,
                        }, ...data),
                        timeout(i),
                    ]);
                    this.startedCounter++;
                }
                let closed = 0;
                for (let i = 0; i < numOfStarts; i++) {
                    try {
                        const worker = yield Promise.race(this.threads);
                        if (!worker) {
                            throw new Error("Worker is null");
                        }
                        worker.success ? this.trueCounter++ : this.falseCounter++;
                        this.logFunc(worker);
                        if (numOfStarts > this.startedCounter) {
                            this.threads[worker.workerID] = Promise.race([
                                this.threadFunc({
                                    workerID: worker.workerID,
                                    startedCounter: this.startedCounter,
                                }, ...data),
                                timeout(worker.workerID),
                            ]);
                            this.startedCounter++;
                        }
                        else {
                            this.threads[worker.workerID] = timeout(worker.workerID);
                            if (++closed == this.threadsCount) {
                                this.threads.map((el) => null);
                            }
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                }
            }
            catch (e) {
                throw e;
            }
        });
        try {
            this.threadFunc = threadFunc;
            this.logFunc = logFunc;
            if (threadsCount < 1) {
                throw new Error("Threads count must be >=1");
            }
            this.threadsCount = threadsCount;
            this.timeout = timeout || 10 * 60 * 1000;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.Threads = Threads;
