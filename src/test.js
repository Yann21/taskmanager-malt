const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('Task Manager', function() {
  this.timeout(30000);

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function() {
    await driver.quit();
  });

  it('should open app and check title', async function() {
    await driver.get('http://localhost:3000');
    const title = await driver.getTitle();
    expect(title).to.equal('TM PrismalAI');
  });

  // Add more tests as required

});
