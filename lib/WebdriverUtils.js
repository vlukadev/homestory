import Utils from "../lib/Utils.js";

/**
 * utils class containing utils methods, selectors and functionality
 */
export default class WebdriverUtils {
  static async scrollPageToElement(element) {
    Utils.log(`scrolling page to ${element}!`);
    browser.execute(`arguments[0].scrollIntoView()`, await $(element));
  }

  static scrollToBottom() {
    Utils.log(`scrolling to the bottom of page!`);
    Utils.execute(`window.scrollTo(0, document.body.scrollHeight);`);
  }

  static scrollToTop() {
    Utils.log(`scrolling to the top of page!`);
    Utils.execute(`window.scrollTo(0,0);`);
  }

  static scroll(x, y) {
    Utils.log(`scrolling page to X : ${x} - Y : ${y}`);
    Utils.execute(`window.scrollTo(${x},${y});`);
  }

  static switchToOverlayFrame() {
    browser.switchToFrame(0);
  }

  static async deleteCookies() {
    await browser.deleteCookies();
    const cookies = await browser.getCookies();
    expect(cookies).toMatchObject([]);
  }

  static async clearLocalStorage() {
    Utils.log(`clear local storage!`);
    Utils.execute(`window.localStorage.clear()`);
  }

  /* ///////////////////////////////////// BROWSER OBJECT ///////////////////////////////////// */
  static async refresh() {
    Utils.log(`refresh page!`);
    await browser.refresh();
  }

  /* /////////////////////////////////////// ELEMENT OBJECT ////////////////////////////////////// */
  static async getCSSProperty(element, cssPropertyName) {
    Utils.log(`get css property - ${cssPropertyName}!`);
    return await element.getCSSProperty(cssPropertyName);
  }

  static async getAttribute(element, attributeName) {
    Utils.log(`get attribute - ${attributeName}!`);
    return await element.getAttribute(attributeName);
  }

  static async getHTML(label, element, includeSelectorTag) {
    if (includeSelectorTag === false) {
      Utils.log(`get inner html code - ${label}!`);
      return await element.getHTML(false);
    }

    Utils.log(`get html code - ${label}!`);
    return await element.getHTML();
  }

  static async getSize(label, element, prop) {
    if (prop === "width") {
      Utils.log(`get size (width) - ${label}!`);
      return await element.getSize("width");
    } else if (prop === "height") {
      Utils.log(`get size (height) - ${label}!`);
      return await element.getSize("height");
    } else {
      Utils.log(`get size - ${label}!`);
      return await element.getSize();
    }
  }

  static async getLocation(label, element, prop) {
    if (prop === "x") {
      Utils.log(`get location (x) - ${label}!`);
      return await element.getLocation("x");
    } else if (prop === "y") {
      Utils.log(`get location (y) - ${label}!`);
      return await element.getLocation("y");
    } else {
      Utils.log(`get location - ${label}!`);
      return await element.getLocation();
    }
  }

  static async click(label, element) {
    Utils.log(`click on ${label}!`);
    await element.click();
  }

  static async moveTo(label, element, xOffset, yOffset) {
    if (xOffset && yOffset) {
      Utils.log(`move to {x: ${xOffset}, y: ${yOffset}} of ${label}!`);
      await element.moveTo({ xOffset, yOffset });
    } else {
      Utils.log(`move to ${label} center!`);
      await element.moveTo();
    }
  }

  static async scrollIntoView(label, element) {
    Utils.log(`scroll ${label} into view!`);
    await browser.execute(`arguments[0].scrollIntoView()`, await element);
  }

  /* ///////////////////////////////////////// EXPECT ///////////////////////////////////////// */

  /* ------------------------------------ Element Matchers ------------------------------------ */
  static async toBeDisplayed(label, element) {
    Utils.log(`expect ${label} to be displayed!`);
    await expect(element).toBeDisplayed({
      message: `${label} isn't displayed!`,
    });
  }

  static async notToBeDisplayed(label, element) {
    Utils.log(`expect ${label} not to be displayed!`);
    await expect(element).not.toBeDisplayed({
      message: `${label} shouldn't be displayed!`,
    });
  }

  static async toBeDisplayedInViewport(label, element) {
    Utils.log(`expect ${label} to be displayed in viewport!`);
    await expect(element).toBeDisplayedInViewport({
      message: `${label} isn't displayed in viewport!`,
    });
  }

  static async notToBeDisplayedInViewport(label, element) {
    Utils.log(`expect ${label} not to be displayed in viewport!`);
    await expect(element).not.toBeDisplayedInViewport({
      message: `${label} shouldn't be displayed in viewport!`,
    });
  }

  static async toBeClickable(label, element) {
    Utils.log(`expect ${label} to be clickable!`);
    await expect(element).toBeClickable({
      message: `${label} isn't clickable!`,
    });
  }

  static async notToBeClickable(label, element) {
    Utils.log(`expect ${label} not to be clickable!`);
    await expect(element).not.toBeClickable({
      message: `${label} shouldn't be clickable!`,
    });
  }

  static async toHaveText(label, element, text) {
    Utils.log(`expect ${label} to have correct text!`);
    await expect(element).toHaveText(text, {
      message: `${label} text is incorrect!`,
    });
  }

  static async toHaveElementClass(label, element, classValue) {
    Utils.log(`expect ${label} to have element class - ${classValue}!`);
    await expect(element).toHaveElementClass(classValue);
  }

  static async notToHaveElementClass(label, element, classValue) {
    Utils.log(`expect ${label} not to have element class - ${classValue}!`);
    await expect(element).not.toHaveElementClass(classValue);
  }

  static async toHaveElementClassContaining(label, element, classValue) {
    Utils.log(
      `expect ${label} to have element class containing - ${classValue}!`
    );
    await expect(element).toHaveElementClassContaining(classValue);
  }

  static async notToHaveElementClassContaining(label, element, classValue) {
    Utils.log(
      `expect ${label} not to have element class containing - ${classValue}!`
    );
    await expect(element).not.toHaveElementClassContaining(classValue);
  }

  static async toHaveAttributeContaining(
    label,
    element,
    attributeName,
    attributeValue
  ) {
    Utils.log(
      `expect ${label} to have attribute ${attributeName} containing ${attributeValue}!`
    );
    await expect(element).toHaveAttributeContaining(
      attributeName,
      attributeValue,
      {
        message: `attribute ${attributeName} isn't containing ${attributeValue}`,
      }
    );
  }

  static async toExist(label, element) {
    Utils.log(`expect ${label} to exist!`);
    await expect(element).toExist({ message: `${label} doesn't exist!` });
  }

  static async notToExist(label, element) {
    Utils.log(`expect ${label} not to exist!`);
    await expect(element).not.toExist({ message: `${label} shouldn't exist!` });
  }

  static async toHaveHref(label, element, href) {
    Utils.log(`expect ${label} to have correct href!`);
    await expect(element).toHaveHref(href, {
      message: `${label} href is incorrect!`,
    });
  }

  static async toHaveHrefContaining(label, element, value) {
    Utils.log(`expect ${label} to have href containing - ${value}!`);
    await expect(element).toHaveHrefContaining(value);
  }

  static async toBeElementsArrayOfSize(label, elements, expectedNumber) {
    Utils.log(
      `expect ${label} to be elements array of size ${expectedNumber}!`
    );
    await expect(elements).toBeElementsArrayOfSize(expectedNumber);
  }

  /* ------------------------------------------ Mocha ----------------------------------------- */
  static toBe(label, received, expected) {
    Utils.log(`expect ${label} to be ${expected}!`);
    expect(received).toBe(expected);
  }

  static toEqual(label, received, expected) {
    Utils.log(`expect ${label} to equal ${expected}!`);
    expect(received).toEqual(expected);
  }

  static notToEqual(label, received, expected) {
    Utils.log(`expect ${label} not to equal ${expected}!`);
    expect(received).not.toEqual(expected);
  }

  static toBeFalsy(label, received) {
    Utils.log(`check if ${label} is null, undefined or empty!`);
    expect(received).toBeFalsy();
  }

  static toBeGreaterThan(label, received, expected) {
    Utils.log(`expect ${label} to be greater than ${expected}!`);
    expect(received).toBeGreaterThan(expected);
  }

  static toBeLessThan(label, received, expected) {
    Utils.log(`expect ${label} to be less than ${expected}!`);
    expect(received).toBeLessThan(expected);
  }

  static toContain(label, received, expected) {
    Utils.log(`expect ${label} to contain ${expected}!`);
    expect(received).toContain(expected);
  }

  static notToContain(label, received, expected) {
    Utils.log(`expect ${label} not to contain ${expected}!`);
    expect(received).not.toContain(expected);
  }

  static toStrictEqual(labelReceived, labelExpected, received, expected) {
    Utils.log(`expect ${labelReceived} to strict equal ${labelExpected}!`);
    expect(received).toStrictEqual(expected);
  }
  /* ///////////////////////////////////// VISUAL TESTING ///////////////////////////////////// */

  /* -------------------------------------- Save Methods -------------------------------------- */
  /**
   *
   * @param {string} label log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async saveElement(label, element, tag, options) {
    Utils.log(`save element - ${label}!`);
    await browser.saveElement(element, tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async saveScreen(tag, options) {
    Utils.log(`save screen!`);
    await browser.saveScreen(tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async saveFullPageScreen(tag, options) {
    Utils.log(`save full page screen!`);
    await browser.saveFullPageScreen(tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async saveTabbablePage(tag, options) {
    Utils.log(`save tabbable page!`);
    await browser.saveTabbablePage(tag, options);
  }

  /**
   *
   * @param {string} label log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async checkElement(label, element, tag, options) {
    Utils.log(`check element - ${label}!`);
    await browser.checkElement(element, tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async checkScreen(tag, options) {
    Utils.log(`check screen!`);
    await browser.checkScreen(tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async checkFullPageScreen(tag, options) {
    Utils.log(`check full page screen!`);
    await browser.checkFullPageScreen(tag, options);
  }

  /**
   *
   * @param {string} tag custom tag name
   * @param {object} options method options (optional)
   */
  static async checkTabbablePage(tag, options) {
    Utils.log(`check tabbable page!`);
    await browser.checkTabbablePage(tag, options);
  }

  /**
   *
   * @param {string} label log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {number} mismatchPercentage mismatch percentage threshold `0-1`
   * @param {object} options method options (optional)
   */
  static async toMatchElementSnapshot(
    label,
    element,
    tag,
    mismatchPercentage,
    options
  ) {
    Utils.log(`expect ${label} to match element snapshot!`);
    await expect(element).toMatchElementSnapshot(
      tag,
      mismatchPercentage,
      options
    );
  }

  /**
   *
   * @param {string} label log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {number} mismatchPercentage mismatch percentage threshold `0-1`
   * @param {object} options method options (optional)
   */
  static async toMatchScreenSnapshot(label, tag, mismatchPercentage, options) {
    Utils.log(`expect ${label} to match screen snapshot!`);
    await expect(browser).toMatchScreenSnapshot(
      tag,
      mismatchPercentage,
      options
    );
  }

  /**
   *
   * @param {string} labwebdriver el log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {number} mismatchPercentage mismatch percentage threshold `0-1`
   * @param {object} options method options (optional)
   */
  static async toMatchFullPageSnapshot(
    label,
    tag,
    mismatchPercentage,
    options
  ) {
    Utils.log(`expect ${label} to match full page snapshot!`);
    await expect(browser).toMatchFullPageSnapshot(
      tag,
      mismatchPercentage,
      options
    );
  }

  /**
   *
   * @param {string} label log text
   * @param {object} element element selector
   * @param {string} tag custom tag name
   * @param {number} mismatchPercentage mismatch percentage threshold `0-1`
   * @param {object} options method options (optional)
   */
  static async toMatchTabbablePageSnapshot(
    label,
    tag,
    mismatchPercentage,
    options
  ) {
    Utils.log(`expect ${label} to match tabbable page snapshot!`);
    await expect(browser).toMatchTabbablePageSnapshot(
      tag,
      mismatchPercentage,
      options
    );
  }
}
