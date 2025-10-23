import { HomePage } from "../../pages/home.page.js";
import { BasePage } from "../../pages/base.page.js";
import WebdriverUtils from "../../lib/WebdriverUtils.js";

describe("Assignment 1", () => {
  before(async () => {
    // Open the home page before running tests
    await BasePage.open();

   
  });

  it("Verify that all listing tiles in the search results display the correct location based on the search criteria", async () => {
    
    // Wait for main page to load with default city
    await HomePage.waitForMainElements("Austin, TX");

    // Search for a location
    await HomePage.searchLocation("Houston, TX");

    await HomePage.searchPriceFilter();

    await browser.pause(5000);
  });
});
