export class BasePage {

  static async open() {
    browser.url(`https://search.homestory.co/`);
    browser.maximizeWindow();
     // Expect the URL to contain the sting "cpbroker/search"
    // await expect(browser).toHaveUrl(expect.stringContaining("cpbroker/search"));
  }
}


