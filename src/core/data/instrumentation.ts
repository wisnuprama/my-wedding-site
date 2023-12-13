import { callOnce } from "@/common/helper";
import { sheetdb } from "@/core/data";
import schedule from "node-schedule";

const init = callOnce(() => {
  console.info("[core.instrumentation] Initializing instrumentation...");

  process.on("SIGINT", function () {
    schedule.gracefulShutdown().then(() => process.exit(0));
  });

  return Promise.all([sheetdb.connect()]);
});

export default init();
