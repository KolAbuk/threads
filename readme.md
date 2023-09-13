# @kolabuk/threads

Node.js threads

## Installation

```bash
npm i @kolabuk/threads
```

## Importing

```javascript
import { Threads, threadFunc } from "@kolabuk/threads";
```

## Usage

```javascript
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
  func, //function with your logic
  (args) => console.log(args), //function for logs
  2, //threads count, >=1
  10 * 1000 //timeout time in ms
);
threads.run(
  15, //times to run threads
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //any data you need
);
const stat = () => {
  //simple example of success/error statistic
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
```
