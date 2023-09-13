export type threadFuncRes = {
  workerID: number;
  success: boolean;
  logText: string;
};

export type threadFunc = (
  { workerID, startedCounter }: { workerID: number; startedCounter: number },
  ...data: any
) => Promise<threadFuncRes>;
export type logFunc = ({ workerID, success, logText }: threadFuncRes) => void;

export class Threads {
  private threadFunc: threadFunc;
  private logFunc: logFunc;
  private timeout: number;
  private threads: Promise<threadFuncRes>[] = [];
  private threadsCount: number;
  private trueCounter: number = 0;
  private falseCounter: number = 0;
  private startedCounter: number = 0;
  constructor(
    threadFunc: threadFunc,
    logFunc: logFunc,
    threadsCount: number,
    timeout?: number
  ) {
    try {
      this.threadFunc = threadFunc;
      this.logFunc = logFunc;
      if (threadsCount < 1) {
        throw new Error("Threads count must be >=1");
      }
      this.threadsCount = threadsCount;
      this.timeout = timeout || 10 * 60 * 1000;
    } catch (e) {
      throw e;
    }
  }
  getTrueCounter = () => this.trueCounter;

  getFalseCounter = () => this.falseCounter;

  getAllCounter = () => this.trueCounter + this.falseCounter;

  run = async (numOfStarts: number, ...data: any) => {
    try {
      if (numOfStarts < 1) {
        throw new Error("Times  must be >=1");
      }
      const timeout = async (workerID: number): Promise<threadFuncRes> => {
        await new Promise((res) => setTimeout(res, this.timeout));
        return {
          workerID,
          success: false,
          logText: "TIMEOUT",
        };
      };
      for (let i = 0; i < this.threadsCount; i++) {
        this.threads[i] = Promise.race([
          this.threadFunc(
            {
              workerID: i,
              startedCounter: this.startedCounter,
            },
            ...data
          ),
          timeout(i),
        ]);
        this.startedCounter++;
      }
      for (let i = 0; i < numOfStarts; i++) {
        try {
          const worker = await Promise.race(this.threads);
          worker.success ? this.trueCounter++ : this.falseCounter++;
          this.logFunc(worker);
          this.threads[worker.workerID] = Promise.race([
            this.threadFunc(
              {
                workerID: worker.workerID,
                startedCounter: this.startedCounter,
              },
              ...data
            ),
            timeout(worker.workerID),
          ]);
          this.startedCounter++;
        } catch (e) {
          throw e;
        }
      }
    } catch (e) {
      throw e;
    }
  };
}
