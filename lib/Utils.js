import WebdriverUtils from "./WebdriverUtils.js"

export default class Utils {
  static log(log, isOff) {
    let isOff_ = isOff || null;

    if (!isOff_) {
      console.log(`****** |`, log);
    }
  }

  /**
   * @param options {object}
   */
  static consoleLog(options) {
    const log = options.log || "",
      type = options.type || "Fg",
      color = options.color || "White",
      isOff = options.isOff || false;

    const currentColor = Utils.terminalColors[type][color];

    if (!isOff) {
      console.log(`****** | ${currentColor}`, log);
    }
  }

  
  

  static terminalColors = {
    Fg: {
      Grey: "\x1b[30m%s\x1b[0m",
      Red: "\x1b[31m%s\x1b[0m",
      Green: "\x1b[32m%s\x1b[0m",
      Yellow: "\x1b[33m%s\x1b[0m",
      Blue: "\x1b[34m%s\x1b[0m",
      Magenta: "\x1b[35m%s\x1b[0m",
      Cyan: "\x1b[36m%s\x1b[0m",
      White: "\x1b[39m%s\x1b[0m",
    },
    Bg: {
      Grey: "\x1b[100m%s\x1b[0m",
      Red: "\x1b[101m%s\x1b[0m",
      Green: "\x1b[102m%s\x1b[0m",
      Yellow: "\x1b[103m%s\x1b[0m",
      Blue: "\x1b[104m%s\x1b[0m",
      Magenta: "\x1b[105m%s\x1b[0m",
      Cyan: "\x1b[106m%s\x1b[0m",
      White: "\x1b[107m%s\x1b[0m",
    },
  };
}
 