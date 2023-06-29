# Slow test reporter for jest( Saving to file and Printing to screen)

This code will report the slowest tests in your Jest suite, along with their duration and file path. It will also warn you if any tests are running slower than a specified threshold. You can configure the number of slowest tests to report, the output file, and the threshold for warning about slow tests by passing options to the JestSlowTestReporter constructor.

## Installation

You may install this package as a development dependency:

```bash
npm install --save-dev jest-slow-test-reporter
yarn add --dev jest-slow-test-reporter
```

## Configuration

Configure [Jest](https://facebook.github.io/jest/docs/en/configuration.html) to use the reporter.

For example, create a `jest.config.js` file containing:

```javascript
module.exports = {
  verbose: false,
  reporters: [
    ['jest-slow-test-reporter', {"outputFile": "path/to/file", "numTests": 8, "warnOnSlowerThan": 300, "color": true}]
  ]
};
```
### Available Options
`outputFile:` path to save output file.<br/>
`numTests:` controls how many slow tests to print.<br/>
`warnOnSlowerThan:` will warn when a test exceeds this time in milliseconds.<br/>
`color:` will make the warnOnSlowerThan warning messages print in red.<br/>
