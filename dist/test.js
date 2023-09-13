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
const _1 = require(".");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const func = ({ workerID, startedCounter }, someMass) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield new Promise((res) => setTimeout(res, Math.floor(Math.random() * 15) * 1000));
                return {
                    workerID,
                    success: Math.round(Math.random()) == 1,
                    logText: `${startedCounter} ${someMass[startedCounter]}`,
                };
            }
            catch (e) {
                throw e;
            }
        });
        const threads = new _1.Threads(func, (args) => console.log(args), 2, 10 * 1000);
        threads.run(15, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const stat = () => {
            try {
                console.log(threads.getTrueCounter(), "/", threads.getFalseCounter(), "//", threads.getAllCounter());
            }
            catch (e) {
                throw e;
            }
        };
        setInterval(stat, 10 * 1000);
    }
    catch (e) {
        console.error(e.message);
    }
}))();
