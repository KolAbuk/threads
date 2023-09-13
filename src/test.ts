import { Threads, threadFunc } from ".";

(async () => {
  try {
    const func: threadFunc = async ({ workerID, startedCounter }, someMass) => {
      try {
        await new Promise((res) =>
          setTimeout(res, Math.floor(Math.random() * 15) * 1000)
        );
        return {
          workerID,
          success: Math.round(Math.random()) == 1,
          logText: `${startedCounter} ${someMass[startedCounter]}`,
        };
      } catch (e) {
        throw e;
      }
    };
    const threads = new Threads(
      func,
      (args) => console.log(args),
      2,
      10 * 1000
    );
    threads.run([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const stat = () => {
      try {
        console.log(
          threads.getTrueCounter(),
          "/",
          threads.getFalseCounter(),
          "//",
          threads.getAllCounter()
        );
      } catch (e) {
        throw e;
      }
    };
    setInterval(stat, 10 * 1000);
  } catch (e: any) {
    console.error(e.message);
  }
})();
