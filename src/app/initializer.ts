import { callOnce } from "@/common/helper";
import { sheetdb } from "@/core/data";
import schedule from "node-schedule";

const init = callOnce(() => {
  sheetdb.connect();
  process.on("SIGINT", function () {
    schedule.gracefulShutdown().then(() => process.exit(0));
  });
});

init();
