const fs = require("fs");
const chalk = require("chalk");

class JestSlowTestReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
        this._slowTests = [];
    }

    async onRunComplete() {
        console.log();

        this._slowTests.sort(function (a, b) {
            return b.duration - a.duration;
        });

        let rootPathRegex = new RegExp(`^${process.cwd()}`);
        let slowestTests = this._slowTests.slice(0, (this._options.numTests || 10));
        let slowTestTime = this._slowTestTime(slowestTests);
        let allTestTime = this._allTestTime();
        let percentTime = (slowTestTime / allTestTime) * 100;

        console.log(chalk.blueBright(`Top ${slowestTests.length} slowest examples (${slowTestTime / 1000} seconds,`
            + ` ${percentTime.toFixed(1)}% of total time):`));

        for (let i = 0; i < slowestTests.length; i++) {
            let duration = slowestTests[i].duration;
            let fullName = slowestTests[i].fullName;
            let filePath = slowestTests[i].filePath.replace(rootPathRegex, '.');
            console.log(`  ${fullName}`);
            console.log(chalk.yellowBright(`    ${duration / 1000} seconds`)+` ${filePath}`);
        }

        if (this._options.outputFile) {
            await fs.writeFileSync(
                this._options.outputFile,
                JSON.stringify(slowestTests, null, 2)
            );
        }

        console.log();
    }

    onTestResult(test, testResult) {
        for (let i = 0; i < testResult.testResults.length; i++) {
            this._slowTests.push({
                duration: testResult.testResults[i].duration,
                fullName: testResult.testResults[i].fullName,
                filePath: testResult.testFilePath
            });

            if (this._options.warnOnSlowerThan && testResult.testResults[i].duration > this._options.warnOnSlowerThan) {
                let warnString = `${testResult.testResults[i].fullName} ran in ${testResult.testResults[i].duration}ms`;
                if (this._options.color) {
                    warnString = `\x1b[31m${warnString}\x1b[0m`;
                }
                console.log(warnString);
            }
        }
    }

    _slowTestTime(slowestTests) {
        let slowTestTime = 0;
        for (let i = 0; i < slowestTests.length; i++) {
            slowTestTime += slowestTests[i].duration;
        }
        return slowTestTime;
    }

    _allTestTime() {
        let allTestTime = 0;
        for (let i = 0; i < this._slowTests.length; i++) {
            allTestTime += this._slowTests[i].duration;
        }
        return allTestTime;
    }
}

module.exports = JestSlowTestReporter;
