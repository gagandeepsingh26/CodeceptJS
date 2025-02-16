---
id: TestCafe
title: TestCafe
---

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## TestCafe

Extends Helper

Uses [TestCafe][1] library to run cross-browser tests.
The browser version you want to use in tests must be installed on your system.

Requires `testcafe` package to be installed.

    npm i testcafe --save-dev

## Configuration

This helper should be configured in codecept.json or codecept.conf.js

-   `url`: base url of website to be tested
-   `show`:  - show browser window.
-   `windowSize`: (optional) - set browser window width and height
-   `getPageTimeout`  config option to set maximum navigation time in milliseconds.
-   `waitForTimeout`: (optional) default wait\ timeout in ms. Default: 5000.
-   `browser`:   - See [https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browsers/browser-support.html][2]

#### Example #1: Show chrome browser window

```js
{
   helpers: {
     TestCafe : {
       url: "http://localhost",
       waitForTimeout: 15000,
       show: true,
       browser: "chrome"
     }
   }
}
```

## Access From Helpers

Call Testcafe methods directly using the testcafe controller.

```js
const testcafeTestController = this.helpers['TestCafe'].t;
const comboBox = Selector('.combo-box');
await testcafeTestController
  .hover(comboBox) // hover over combo box
  .click('#i-prefer-both') // click some other element
```

## Methods

### Parameters

-   `config`  

### \_locate

Get elements by different locator types, including strict locator
Should be used in custom helpers:

```js
const elements = await this.helpers['TestCafe']._locate('.item');
```

#### Parameters

-   `locator`  

### amOnPage

Opens a web page in a browser. Requires relative or absolute url.
If url starts with `/`, opens a web page of a site defined in `url` config parameter.

```js
I.amOnPage('/'); // opens main page of website
I.amOnPage('https://github.com'); // opens github
I.amOnPage('/login'); // opens a login page
```

#### Parameters

-   `url` [string][3] url path or global url.
    


### appendField

Appends text to a input field or textarea.
Field is located by name, label, CSS or XPath

```js
I.appendField('#myTextField', 'appended');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator
-   `value` [string][3] text value to append.
    


### attachFile

Appends text to a input field or textarea.
Field is located by name, label, CSS or XPath

```js
I.appendField('#myTextField', 'appended');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator
-   `pathToFile`  
-   `value` [string][3] text value to append.
    


### checkOption

Selects a checkbox or radio button.
Element is located by label or name or CSS or XPath.

The second parameter is a context (CSS or XPath locator) to narrow the search.

```js
I.checkOption('#agree');
I.checkOption('I Agree to Terms and Conditions');
I.checkOption('agree', '//form');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) checkbox located by label | name | CSS | XPath | strict locator.
-   `context` [string][3] (optional, `null` by default) element located by CSS | XPath | strict locator.
    
 

### clearCookie

Clears a cookie by name,
if none provided clears all cookies.

```js
I.clearCookie();
I.clearCookie('test');
```

#### Parameters

-   `cookieName`  
-   `cookie` [string][3] (optional, `null` by default) cookie name
    


### clearField

Clears a `<textarea>` or text `<input>` element's value.

```js
I.clearField('Email');
I.clearField('user[email]');
I.clearField('#email');
```

#### Parameters

-   `field`  
-   `editable` ([string][3] \| [object][4]) field located by label|name|CSS|XPath|strict locator.
    


### click

Perform a click on a link or a button, given by a locator.
If a fuzzy locator is given, the page will be searched for a button, link, or image matching the locator string.
For buttons, the "value" attribute, "name" attribute, and inner text are searched. For links, the link text is searched.
For images, the "alt" attribute and inner text of any parent links are searched.

The second parameter is a context (CSS or XPath locator) to narrow the search.

```js
// simple link
I.click('Logout');
// button of form
I.click('Submit');
// CSS button
I.click('#form input[type=submit]');
// XPath
I.click('//form/[@type=submit]');
// link in context
I.click('Logout', '#nav');
// using strict locator
I.click({css: 'nav a.login'});
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) clickable link or button located by text, or any element located by CSS|XPath|strict locator.
-   `context` ([string][3] \| [object][4]) (optional, `null` by default) element to search in CSS|XPath|Strict locator.
    
 

### dontSee

Opposite to `see`. Checks that a text is not present on a page.
Use context parameter to narrow down the search.

```js
I.dontSee('Login'); // assume we are already logged in.
I.dontSee('Login', '.nav'); // no login inside .nav element
```

#### Parameters

-   `text` [string][3] which is not present.
-   `context` ([string][3] \| [object][4]) (optional) element located by CSS|XPath|strict locator in which to perfrom search.
 

### dontSeeCheckboxIsChecked

Verifies that the specified checkbox is not checked.

```js
I.dontSeeeCheckboxIsChedcked('#agree'); // located by ID
I.dontSeeeCheckboxIsChedcked('I agree to terms'); // located by label
I.dontSeeeCheckboxIsChedcked('agree'); // located by name
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator.
    


### dontSeeCookie

Checks that cookie with given name does not exist.

```js
I.dontSeeCookie('auth'); // no auth cookie
```

#### Parameters

-   `name` [string][3] cookie name.
    


### dontSeeCurrentUrlEquals

Checks that current url is not equal to provided one.
If a relative url provided, a configured url will be prepended to it.

```js
I.dontSeeCurrentUrlEquals('/login'); // relative url are ok
I.dontSeeCurrentUrlEquals('http://mysite.com/login'); // absolute urls are also ok
```

#### Parameters

-   `url` [string][3] value to check.
    


### dontSeeElement

Opposite to `seeElement`. Checks that element is not visible (or in DOM)

```js
I.dontSeeElement('.modal'); // modal is not shown
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) located by CSS|XPath|Strict locator.
    


### dontSeeElementInDOM

Opposite to `seeElementInDOM`. Checks that element is not on page.

```js
I.dontSeeElementInDOM('.nav'); // checks that element is not on page visible or not
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) located by CSS|XPath|Strict locator.
    


### dontSeeInCurrentUrl

Checks that current url does not contain a provided fragment.

#### Parameters

-   `url` [string][3] value to check.
    


### dontSeeInField

Checks that value of input field or textare doesn't equal to given value
Opposite to `seeInField`.

```js
I.dontSeeInField('email', 'user@user.com'); // field by name
I.dontSeeInField({ css: 'form input.email' }, 'user@user.com'); // field by CSS
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator.
-   `value` [string][3] value to check.
    


### dontSeeInSource

Checks that the current page does not contains the given string in its raw source code.

```js
I.dontSeeInSource('<!--'); // no comments in source
```

#### Parameters

-   `text`  
-   `value` [string][3] to check.
    


### doubleClick

Performs a double-click on an element matched by link|button|label|CSS or XPath.
Context can be specified as second parameter to narrow search.

```js
I.doubleClick('Edit');
I.doubleClick('Edit', '.actions');
I.doubleClick({css: 'button.accept'});
I.doubleClick('.btn.edit');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) clickable link or button located by text, or any element located by CSS|XPath|strict locator.
-   `context` ([string][3] \| [object][4]) (optional, `null` by default) element to search in CSS|XPath|Strict locator.
    
 

### executeScript

Executes sync script on a page.
Pass arguments to function as additional parameters.
Will return execution result to a test.
In this case you should use async function and await to receive results.

Example with jQuery DatePicker:

```js
// change date of jQuery DatePicker
I.executeScript(function() {
  // now we are inside browser context
  $('date').datetimepicker('setDate', new Date());
});
```

Can return values. Don't forget to use `await` to get them.

```js
let date = await I.executeScript(function(el) {
  // only basic types can be returned
  return $(el).datetimepicker('getDate').toString();
}, '#date'); // passing jquery selector
```

#### Parameters

-   `fn` ([string][3] \| [function][5]) function to be executed in browser context.
-   `args` ...any 

### fillField

Fills a text field or textarea, after clearing its value, with the given string.
Field is located by name, label, CSS, or XPath.

```js
// by label
I.fillField('Email', 'hello@world.com');
// by name
I.fillField('password', secret('123456'));
// by CSS
I.fillField('form#login input[name=username]', 'John');
// or by strict locator
I.fillField({css: 'form#login input[name=username]'}, 'John');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator.
-   `value` [string][3] text value to fill.
    


### grabAttributeFrom

Retrieves an attribute from an element located by CSS or XPath and returns it to test.
An array as a result will be returned if there are more than one matched element.
Resumes test execution, so should be used inside async with `await` operator.

```js
let hint = await I.grabAttributeFrom('#tooltip', 'title');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `attr` [string][3] attribute name.

Returns [Promise][6]&lt;[string][3]> attribute value



### grabBrowserLogs

Get JS log from browser.

```js
let logs = await I.grabBrowserLogs();
console.log(JSON.stringify(logs))
```

### grabCookie

Gets a cookie object by name.
If none provided gets all cookies.

-   Resumes test execution, so should be used inside async with `await` operator.

```js
let cookie = await I.grabCookie('auth');
assert(cookie.value, '123456');
```

#### Parameters

-   `name`  cookie name. 

Returns [Promise][6]&lt;[string][3]> attribute value

Returns cookie in JSON format. If name not passed returns all cookies for this domain.

### grabCurrentUrl

Get current URL from browser.
Resumes test execution, so should be used inside an async function.

```js
let url = await I.grabCurrentUrl();
console.log(`Current URL is [${url}]`);
```

Returns [Promise][6]&lt;[string][3]> current URL



### grabNumberOfVisibleElements

Grab number of visible elements by locator.

```js
let numOfElements = await I.grabNumberOfVisibleElements('p');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) located by CSS|XPath|strict locator.

Returns [Promise][6]&lt;[number][7]> number of visible elements



### grabSource

Retrieves page source and returns it to test.
Resumes test execution, so should be used inside an async function.

```js
let pageSource = await I.grabSource();
```

Returns [Promise][6]&lt;[string][3]> source code



### grabTextFrom

Retrieves a text from an element located by CSS or XPath and returns it to test.
Resumes test execution, so should be used inside async with `await` operator.

```js
let pin = await I.grabTextFrom('#pin');
```

If multiple elements found returns an array of texts.

#### Parameters

-   `locator`  element located by CSS|XPath|strict locator.

Returns [Promise][6]&lt;[string][3]> attribute value



### grabValueFrom

Retrieves a value from a form element located by CSS or XPath and returns it to test.
Resumes test execution, so should be used inside async function with `await` operator.

```js
let email = await I.grabValueFrom('input[name=email]');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) field located by label|name|CSS|XPath|strict locator.

Returns [Promise][6]&lt;[string][3]> attribute value



### moveCursorTo

Moves cursor to element matched by locator.
Extra shift can be set with offsetX and offsetY options.

```js
I.moveCursorTo('.tooltip');
I.moveCursorTo('#submit', 5,5);
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) located by CSS|XPath|strict locator.
-   `offsetX` [number][7] (optional, `0` by default) X-axis offset. 
-   `offsetY` [number][7] (optional, `0` by default) Y-axis offset.
    
 

### pressKey

Presses a key on a focused element.
Special keys like 'Enter', 'Control', [etc][8]
will be replaced with corresponding unicode.
If modifier key is used (Control, Command, Alt, Shift) in array, it will be released afterwards.

```js
I.pressKey('Enter');
I.pressKey(['Control','a']);
```

#### Parameters

-   `key` ([string][3] \| [array][9]) key or array of keys to press.
    



[Valid key names](https://w3c.github.io/webdriver/#keyboard-actions) are:

- `'Add'`,
- `'Alt'`,
- `'ArrowDown'` or `'Down arrow'`,
- `'ArrowLeft'` or `'Left arrow'`,
- `'ArrowRight'` or `'Right arrow'`,
- `'ArrowUp'` or `'Up arrow'`,
- `'Backspace'`,
- `'Command'`,
- `'Control'`,
- `'Del'`,
- `'Divide'`,
- `'End'`,
- `'Enter'`,
- `'Equals'`,
- `'Escape'`,
- `'F1 to F12'`,
- `'Home'`,
- `'Insert'`,
- `'Meta'`,
- `'Multiply'`,
- `'Numpad 0'` to `'Numpad 9'`,
- `'Pagedown'` or `'PageDown'`,
- `'Pageup'` or `'PageUp'`,
- `'Pause'`,
- `'Semicolon'`,
- `'Shift'`,
- `'Space'`,
- `'Subtract'`,
- `'Tab'`.

### refreshPage

Reload the current page.

```js
I.refreshPage();
```




### resizeWindow

Resize the current window to provided width and height.
First parameter can be set to `maximize`.

#### Parameters

-   `width` [number][7] width in pixels or `maximize`.
-   `height` [number][7] height in pixels.
    


### rightClick

Performs right click on a clickable element matched by semantic locator, CSS or XPath.

```js
// right click element with id el
I.rightClick('#el');
// right click link or button with text "Click me"
I.rightClick('Click me');
// right click button with text "Click me" inside .context
I.rightClick('Click me', '.context');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) clickable element located by CSS|XPath|strict locator.
-   `context` ([string][3] \| [object][4]) (optional, `null` by default) element located by CSS|XPath|strict locator.
    
 

### saveScreenshot

Saves a screenshot to ouput folder (set in codecept.json or codecept.conf.js).
Filename is relative to output folder.
Optionally resize the window to the full available page `scrollHeight` and `scrollWidth` to capture the entire page by passing `true` in as the second argument.

```js
I.saveScreenshot('debug.png');
I.saveScreenshot('debug.png', true) //resizes to available scrollHeight and scrollWidth before taking screenshot
```

#### Parameters

-   `fileName` [string][3] file name to save.
-   `fullPage` [boolean][10] (optional, `false` by default) flag to enable fullscreen screenshot mode.
    


### see

Checks that a page contains a visible text.
Use context parameter to narrow down the search.

```js
I.see('Welcome'); // text welcome on a page
I.see('Welcome', '.content'); // text inside .content div
I.see('Register', {css: 'form.register'}); // use strict locator
```

#### Parameters

-   `text` [string][3] expected on page.
-   `context` ([string][3] \| [object][4]) (optional, `null` by default) element located by CSS|Xpath|strict locator in which to search for text.
    
 

### seeCheckboxIsChecked

Verifies that the specified checkbox is checked.

```js
I.seeCheckboxIsChecked('Agree');
I.seeCheckboxIsChecked('#agree'); // I suppose user agreed to terms
I.seeCheckboxIsChecked({css: '#signup_form input[type=checkbox]'});
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator.
    


### seeCookie

Checks that cookie with given name exists.

```js
I.seeCookie('Auth');
```

#### Parameters

-   `name` [string][3] cookie name.
    


### seeCurrentUrlEquals

Checks that current url is equal to provided one.
If a relative url provided, a configured url will be prepended to it.
So both examples will work:

```js
I.seeCurrentUrlEquals('/register');
I.seeCurrentUrlEquals('http://my.site.com/register');
```

#### Parameters

-   `url` [string][3] value to check.
    


### seeElement

Checks that a given Element is visible
Element is located by CSS or XPath.

```js
I.seeElement('#modal');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) located by CSS|XPath|strict locator.
    


### seeElementInDOM

Checks that a given Element is present in the DOM
Element is located by CSS or XPath.

```js
I.seeElementInDOM('#modal');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
    


### seeInCurrentUrl

Checks that current url contains a provided fragment.

```js
I.seeInCurrentUrl('/register'); // we are on registration page
```

#### Parameters

-   `url` [string][3] a fragment to check
    


### seeInField

Checks that the given input field or textarea equals to given value.
For fuzzy locators, fields are matched by label text, the "name" attribute, CSS, and XPath.

```js
I.seeInField('Username', 'davert');
I.seeInField({css: 'form textarea'},'Type your comment here');
I.seeInField('form input[type=hidden]','hidden_value');
I.seeInField('#searchform input','Search');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) located by label|name|CSS|XPath|strict locator.
-   `value` [string][3] value to check.
    


### seeInSource

Checks that the current page contains the given string in its raw source code.

```js
I.seeInSource('<h1>Green eggs &amp; ham</h1>');
```

#### Parameters

-   `text` [string][3] value to check.
    


### seeNumberOfVisibleElements

Asserts that an element is visible a given number of times.
Element is located by CSS or XPath.

```js
I.seeNumberOfVisibleElements('.buttons', 3);
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `num` [number][7] number of elements.
    


### seeTextEquals

Checks that text is equal to provided one.

```js
I.seeTextEquals('text', 'h1');
```

#### Parameters

-   `text`  
-   `context`   

### selectOption

Selects an option in a drop-down select.
Field is searched by label | name | CSS | XPath.
Option is selected by visible text or by value.

```js
I.selectOption('Choose Plan', 'Monthly'); // select by label
I.selectOption('subscription', 'Monthly'); // match option by text
I.selectOption('subscription', '0'); // or by value
I.selectOption('//form/select[@name=account]','Premium');
I.selectOption('form select[name=account]', 'Premium');
I.selectOption({css: 'form select[name=account]'}, 'Premium');
```

Provide an array for the second argument to select multiple options.

```js
I.selectOption('Which OS do you use?', ['Android', 'iOS']);
```

#### Parameters

-   `select` ([string][3] \| [object][4]) field located by label|name|CSS|XPath|strict locator.
-   `option` ([string][3] \| [array][9]) visible text or value of option.
    


### setCookie

Sets a cookie.

```js
I.setCookie({name: 'auth', value: true});
```

#### Parameters

-   `cookie` [object][4] a cookie object.
    


### switchTo

Switches frame or in case of null locator reverts to parent.

```js
I.switchTo('iframe'); // switch to first iframe
I.switchTo(); // switch back to main page
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) (optional, `null` by default) element located by CSS|XPath|strict locator.
    


### uncheckOption

Unselects a checkbox or radio button.
Element is located by label or name or CSS or XPath.

The second parameter is a context (CSS or XPath locator) to narrow the search.

```js
I.uncheckOption('#agree');
I.uncheckOption('I Agree to Terms and Conditions');
I.uncheckOption('agree', '//form');
```

#### Parameters

-   `field` ([string][3] \| [object][4]) checkbox located by label | name | CSS | XPath | strict locator.
-   `context` [string][3] (optional, `null` by default) element located by CSS | XPath | strict locator.
    
 

### wait

Pauses execution for a number of seconds.

```js
I.wait(2); // wait 2 secs
```

#### Parameters

-   `sec` [number][7] number of second to wait.
    


### waitForElement

Waits for element to be present on page (by default waits for 1sec).
Element can be located by CSS or XPath.

```js
I.waitForElement('.btn.continue');
I.waitForElement('.btn.continue', 5); // wait for 5 secs
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    


### waitForFunction

Waits for a function to return true (waits for 1 sec by default).
Running in browser context.

```js
I.waitForFunction(fn[, [args[, timeout]])
```

```js
I.waitForFunction(() => window.requests == 0);
I.waitForFunction(() => window.requests == 0, 5); // waits for 5 sec
I.waitForFunction((count) => window.requests == count, [3], 5) // pass args and wait for 5 sec
```

#### Parameters

-   `fn` ([string][3] \| [function][5]) to be executed in browser context.
-   `argsOrSec` ([array][9] \| [number][7]) (optional, `1` by default) arguments for function or seconds. 
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    
 

### waitForInvisible

Waits for an element to be removed or become invisible on a page (by default waits for 1sec).
Element can be located by CSS or XPath.

```js
I.waitForInvisible('#popup');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    


### waitForText

Waits for a text to appear (by default waits for 1sec).
Element can be located by CSS or XPath.
Narrow down search results by providing context.

```js
I.waitForText('Thank you, form has been submitted');
I.waitForText('Thank you, form has been submitted', 5, '#modal');
```

#### Parameters

-   `text` [string][3] to wait for.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait 
-   `context` ([string][3] \| [object][4]) (optional) element located by CSS|XPath|strict locator.
    
 

### waitForVisible

Waits for an element to become visible on a page (by default waits for 1sec).
Element can be located by CSS or XPath.

```js
I.waitForVisible('#popup');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    


### waitInUrl

Waiting for the part of the URL to match the expected. Useful for SPA to understand that page was changed.

```js
I.waitInUrl('/info', 2);
```

#### Parameters

-   `urlPart` [string][3] value to check.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    
 

### waitNumberOfVisibleElements

Waits for a specified number of elements on the page.

```js
I.waitNumberOfVisibleElements('a', 3);
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `num` [number][7] number of elements.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    


### waitToHide

Waits for an element to hide (by default waits for 1sec).
Element can be located by CSS or XPath.

```js
I.waitToHide('#popup');
```

#### Parameters

-   `locator` ([string][3] \| [object][4]) element located by CSS|XPath|strict locator.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    


### waitUrlEquals

Waits for the entire URL to match the expected

```js
I.waitUrlEquals('/info', 2);
I.waitUrlEquals('http://127.0.0.1:8000/info');
```

#### Parameters

-   `urlPart` [string][3] value to check.
-   `sec` [number][7] (optional, `1` by default) time in seconds to wait
    
 

## getPageUrl

Client Functions

### Parameters

-   `t`  

[1]: https://github.com/DevExpress/testcafe

[2]: https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browsers/browser-support.html

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[8]: https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
