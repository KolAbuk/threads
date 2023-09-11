export type threadFuncRes = {
  workerID: number;
  success: boolean;
  response: any;
};

export type threadFunc = (
  args: { workerID: number },
  ...data: any
) => threadFuncRes;
export type logFunc = (args: threadFuncRes) => void;

export class Threads {
  private threadFunc: threadFunc;
  private logFunc: logFunc;
  private timeout: number;
  private threads: Promise<threadFuncRes>[] = [];
  constructor(threadFunc: threadFunc, logFunc: logFunc, timeout?: number) {
    this.threadFunc = threadFunc;
    this.logFunc = logFunc;
    this.timeout = timeout || 30000;
  }
  run = (threadsCount: number, ...data: any) => {};
}
