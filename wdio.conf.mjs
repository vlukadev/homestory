import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

export const config = {
  suites: {
   
    // Test 1
    locationSearchVerification: ["./test/locationSearchVerification/spec.js"],
    // Test 2
    priceFilterFunctionality: ["./test/priceFilterFunctionality/spec.js"],

  },

  maxInstances: 10,

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        binary: process.env.Chrome_PATH,
        args: [
          // "--headless",
          // "--no-sandbox",
          "--disable-gpu",
          "--window-size=1920,1080",
          "--disable-dev-shm-usage",
          "--disable-logging",
          "--log-level=3",
          "--silent",
        ],
        perfLoggingPrefs: {
          enableNetwork: true,
          enablePage: true,
        },
        w3c: true,
      },
      "goog:loggingPrefs": {
        performance: "ALL",
        browser: "ALL",
        driver: "ALL",
        server: "ALL",
        client: "ALL",
      },
    },
  ],

  logLevel: "error",

  bail: 0,

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",

  reporters: [
    [
      "spec",
      {
        symbols: {
          passed: "✓",
          failed: "✖",
        },
        onlyFailures: false,
        addConsoleLogs: false,
        showPreface: false,
      },
    ],
    ...(process.env.generateReport == "true"
      ? [
          [
            "allure",
            {
              outputDir: "results/allure/allure-results",
              disableWebdriverStepsReporting: true,
              disableWebdriverScreenshotsReporting: true,
              disableMochaHooks: true,
              reportedEnvironmentVars: {
                chrome:
                  "ec2 docker container - linux debian | browser chrome lts",
              },
            },
          ],
        ]
      : []),
  ],

  services: [
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 240000,
  },
  onWorkerStart(cid, caps, specs, args) {
    process.env.SUITE = args.suite[0];
    process.env.DIVID = args.suite[1];
    process.env.PLATFORM = process.env.npm_lifecycle_event;
  },

  beforeSuite: function (suite) {
    // Extract the suite name by checking arguments passed to the npm script
    const suiteNameArg = process.env.npm_config_argv
      ? JSON.parse(process.env.npm_config_argv).original
      : process.argv;

    const suiteName = suiteNameArg[suiteNameArg.length - 1]; 
    global.currentSuiteName = suiteName || "Unknown Suite";

    console.log(`Running Suite: ${global.currentSuiteName}`);
  },

  

  // Delete temporary files after test execution on docker container
  onComplete: async function (exitCode, config, capabilities, results) {
    const tmpDir = "/tmp";

    const deleteDirectories = async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = await fs.promises.stat(filePath);

          if (stat.isDirectory()) {
            // Skip directories named "chromedriver"
            if (file === "chromedriver") {
              continue;
            }

            await fs.promises.rm(filePath, { recursive: true });
          }
        }
      } catch (err) {
      
        console.log("OnComplete Hook:", err);
      }
    };

    JSON.parse(process.env.isLive) && (await deleteDirectories(tmpDir));

    console.log("Temporary directories deleted.");
  },
};
