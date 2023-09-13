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
        this.run = (...data) => __awaiter(this, void 0, void 0, function* () {
            try {
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
                while (1) {
                    try {
                        const worker = yield Promise.race(this.threads);
                        worker.success ? this.trueCounter++ : this.falseCounter++;
                        this.logFunc(worker);
                        this.threads[worker.workerID] = Promise.race([
                            this.threadFunc({
                                workerID: worker.workerID,
                                startedCounter: this.startedCounter,
                            }, ...data),
                            timeout(worker.workerID),
                        ]);
                        this.startedCounter++;
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