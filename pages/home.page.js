import homeConfig from "./xpaths/homeXPaths.json" with { type: "json" };
import WebdriverUtils from "../lib/WebdriverUtils.js";
import Utils from "../lib/Utils.js";
import MainConfig from "../config/mainConfig.json" with { type: "json" };


class Selectors {
  // Main page elements
  get locationSearchInput() {
    return $(homeConfig.mainElements.locationSearchInput);
  }
  get updatingResultsLoader() {
    return $(homeConfig.mainElements.updatingResultsLoader);
  }
  get focusResult() {
    return $(homeConfig.mainElements.focusResult);
  }
  get defaultMap() {
    return $(homeConfig.mainElements.defaultMap);
  }

  // Search elements
  get searchLocationButton() {
    return $(homeConfig.search.searchLocationButton);
  }
  get cityListItem() {
    return (city) => $(`//div[@aria-label="${city}"]`);
  }

  // Listing card elements
  get headerCityName() {
    return $(homeConfig.listingCard.listingHeader);
  }
  get listings() {
    return $$(homeConfig.listingCard.listings);
  }
  get listingPrice() {
    return homeConfig.listingCard.listingPrice;
  }

  // Price filter elements
  get priceFilterButton() {
    return $(homeConfig.priceFilter.priceFilterButton);
  }
  get minPriceInput() {
    return $(homeConfig.priceFilter.minPriceInput);
  }
  get maxPriceInput() {
    return $(homeConfig.priceFilter.maxPriceInput);
  }
  get minPriceSelectBase() {
    return homeConfig.priceFilter.minPriceSelectBase;
  }
  get maxPriceSelectBase() {
    return homeConfig.priceFilter.maxPriceSelectBase;
  }


}

export class HomePage {
  static $ = new Selectors();


  // Wait for main elements to be displayed
  static async waitForMainElements(defaultCity) {


    // This part is only necessary because of CAPTCHA on the site
    await browser.waitUntil(
      async () => await (await HomePage.$.locationSearchInput).isDisplayed(),
      {
        timeout: 240000,
        timeoutMsg: 'CAPTCHA not solved or location search input not visible after 5 min',
        interval: 2000,
      }
    );

    let defaultSearchInputContent =
      await HomePage.$.locationSearchInput.getValue();

    WebdriverUtils.toEqual(
      "default location search input content",
      defaultSearchInputContent,
      defaultCity
    );
    await WebdriverUtils.notToBeDisplayed(
      "updating results loader",
      HomePage.$.updatingResultsLoader
    );
    await WebdriverUtils.toBeDisplayed("focus result", HomePage.$.focusResult);
    await WebdriverUtils.toBeDisplayed("default map", HomePage.$.defaultMap);
  }

  // Search for a location, select it and click search
  static async searchLocation(location) {

    await WebdriverUtils.toBeClickable(
      "location search input",
      HomePage.$.locationSearchInput
    );
    await WebdriverUtils.click(
      "location search input",
      HomePage.$.locationSearchInput
    )

    await browser.keys(["Control", "a"]);
    await browser.keys("Backspace");

    await HomePage.$.locationSearchInput.setValue(location);

    await WebdriverUtils.toBeClickable(
      "search location button",
      HomePage.$.searchLocationButton
    )
    await WebdriverUtils.click(
      "search location button",
      HomePage.$.searchLocationButton
    );

    await HomePage.$.cityListItem(location).click();
  }

  // Verify that all listings are in the expected city
  static async verifyListingsCity(location) {

    await HomePage.waitForCardElements();

    await HomePage.$.headerCityName.waitForDisplayed();
    WebdriverUtils.toContain("header city name", await HomePage.$.headerCityName.getText(), location);


    const listings = await HomePage.$.listings;

    if (listings.length === 0) {
      Utils.consoleLog({
        log: "No listings found!",
        color: "Red",
      });
    }

    for (const listing of listings) {
      const ariaLabel = await listing.getAttribute('aria-label');
      if (!ariaLabel.includes(location)) {
        Utils.consoleLog({
          log: `Found listing not in ${location}: ${ariaLabel}`,
          color: "Red",
        });
        return false;
      }
    }

    Utils.consoleLog({
      log: `All ${listings.length} listings are in ${location}`,
      color: "Green",
    });
    return true;
  }

  /* 
    Search for properties between the price ranges.
    Price ranges are hardcoded in the config/mainConfig.json
    Check if all property cost is between the min and max price
    Set the values using setValue and check the prices again
  */
  static async searchPriceFilter() {
    const minPrices = MainConfig.minPrice;
    const maxPrices = MainConfig.maxPrice;

    // Iterate multiple times to confirm that the price filter works properly
    for (let i = 0; i < minPrices.length; i++) {
      const minPrice = minPrices[i];
      const maxPrice = maxPrices[i];

      await WebdriverUtils.toBeClickable(
        "price range button",
        HomePage.$.priceFilterButton
      );
      await WebdriverUtils.click(
        "price range button",
        HomePage.$.priceFilterButton
      );

      // Choose min price
      await WebdriverUtils.toBeDisplayed("min price dropdown", HomePage.$.minPriceInput);
      await WebdriverUtils.toBeClickable("select min price range", HomePage.$.minPriceInput);
      await WebdriverUtils.click("select min price range", HomePage.$.minPriceInput);

      const minPriceSelect = await HomePage.getMinPriceValue(minPrice);
      await WebdriverUtils.toBeClickable(`choose min price ${minPrice}`, minPriceSelect);
      await WebdriverUtils.click(`choose min price ${minPrice}`, minPriceSelect);

      await WebdriverUtils.toBeClickable(
        "price range button",
        HomePage.$.priceFilterButton
      );
      await WebdriverUtils.click(
        "price range button",
        HomePage.$.priceFilterButton
      );

      // Choose max price
      await WebdriverUtils.toBeClickable("select max price range", HomePage.$.maxPriceInput);
      await WebdriverUtils.click("select max price range", HomePage.$.maxPriceInput);

      const maxPriceSelect = await HomePage.getMaxPriceValue(maxPrice);
      await WebdriverUtils.toBeClickable(`choose max price ${maxPrice}`, maxPriceSelect);
      await WebdriverUtils.click(`choose max price ${maxPrice}`, maxPriceSelect);

      await this.waitForMainElements("Houston, TX");

      const priceRangeMatch = await this.checkPriceRange(minPrice, maxPrice);

      // Return true or fail the test
      WebdriverUtils.toBe(
        "function to check if only properties between price ranges show",
        priceRangeMatch,
        true
      )
    }

    await WebdriverUtils.toBeClickable(
      "price range button",
      HomePage.$.priceFilterButton
    );
    await WebdriverUtils.click(
      "price range button",
      HomePage.$.priceFilterButton
    );

    await HomePage.$.minPriceInput.setValue(minPrices[0]);
    await browser.keys("Enter");
    await HomePage.$.maxPriceInput.setValue(maxPrices[1])
    await browser.keys("Enter");

    const priceRangeMatch = await this.checkPriceRange(minPrices[0], maxPrices[1]);
    WebdriverUtils.toBe(
      "function to check if only properties between price ranges show",
      priceRangeMatch,
      true
    )

  }

  // Selector for min price value by amount
  static async getMinPriceValue(amount) {
    const element = await $(`//div[contains(@class, "min_price_input__menu-list")]//div[normalize-space(text())="${amount}"]`)
    return element;
  }
  // Selector for max price value by amount
  static async getMaxPriceValue(amount) {
    const element = await $(`//div[@role='option' and normalize-space(text())='${amount}']`);
    return element;
  }

  // Check if price range on listing cards is between the allowed min and max price
  static async checkPriceRange(minPrice, maxPrice) {

    const listings = await HomePage.$.listings;

    for (const listing of listings) {
      const priceElement = await listing.$('.//*[contains(@class, "listingItem__price")]');
      const priceText = await priceElement.getText();

      const match = priceText.match(/\$\d[\d,]*/);
      // if (!match) continue; 

      const price = parseInt(match[0].replace(/[^0-9]/g, ''), 10);
      Utils.log(`Checking price: ${price}`)

      if (price < minPrice || price > maxPrice) {
        Utils.log(`Listing price ${price} is outside range (${minPrice}-${maxPrice})`)

        return false;
      }
    }
    Utils.log(`All listings are within the range ${minPrice} - ${maxPrice}`)
    return true;
  }

  // Wait for listing cards to load
  static async waitForCardElements() {

    await WebdriverUtils.toBeDisplayed(
      "updating results loader",
      HomePage.$.updatingResultsLoader
    );
    await WebdriverUtils.notToBeDisplayed(
      "updating results loader",
      HomePage.$.updatingResultsLoader
    );
  }

}