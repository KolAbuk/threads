export type threadFuncRes = {
    workerID: number;
    success: boolean;
    logText: string;
};
export type threadFunc = ({ workerID, startedCounter }: {
    workerID: number;
    startedCounter: number;
}, ...data: any) => Promise<threadFuncRes>;
export type logFunc = ({ workerID, success, logText }: threadFuncRes) => void;
export declare class Threads {
    private threadFunc;
    private logFunc;
    private timeout;
    private threads;
    private threadsCount;
    private trueCounter;
    private falseCounter;
    private startedCounter;
    constructor(threadFunc: threadFunc, logFunc: logFunc, threadsCount: number, timeout?: number);
    getTrueCounter: () => number;
    getFalseCounter: () => number;
    getAllCounter: () => number;
    run: (numOfStarts: number, ...data: any) => Promise<void>;
}
