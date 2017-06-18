let tapOut = require("tap-out");
let through = require("through2");
let duplexer = require("duplexer");
let format = require("chalk");
let prettyMs = require("pretty-ms");
let symbols = require("figures");

module.exports = () =>
{
  let output = through();
  let parser = tapOut();
  let stream = duplexer(parser, output);
  let startTime = new Date().getTime();

  output.push("\n");

 // parser.on("test", function (test) {

 //   output.push("\n" + pad(format.underline(test.name)) + "\n\n");
 // });

  // Passing assertions
  //parser.on("pass", function (assertion) {

  //  let glyph = format.green(symbols.tick);
  //  let name = format.dim(assertion.name);

  //  output.push(pad("  " + glyph + " " + name + "\n"));
  //});

  // Failing assertions
  parser.on("fail", (assertion) =>
  {
    let glyph = symbols.cross;
    let title =  glyph + " " + assertion.name;
    let raw = format.cyan(prettifyRawError(assertion.error.raw));
    let divider = new Array(title.length + 1).fill(
      "-"
    ).join("");

    output.push("\n" + pad("  " + format.red(title) + "\n"));
    output.push(pad("  " + format.red(divider) + "\n"));
    output.push(raw);

    stream.failed = true;
  });

  parser.on("comment", (comment) =>
  {
    output.push(pad("  " + format.yellow(comment.raw)) + "\n");
  });

  // All done
  parser.on("output", (results) =>
  {
    output.push("\n");

    // Most likely a failure upstream
    if (results.plans.length < 1) 
    {
      process.exit(1);
    }

    if (results.fail.length > 0) 
    {
      output.push(formatErrors(results));
      output.push("\n");
    }

    output.push(formatTotals(results));
    output.push("\n\n");

    // Exit if no tests run. This is a result of 1 of 2 things:
    //  1. No tests were written
    //  2. There was some error before the TAP got to the parser
    if (results.tests.length === 0) 
    {
      process.exit(1);
    }
  });

  // Utils-----------------------------
  function prettifyRawError (rawError) 
  {
    return rawError.split("\n").map((line) =>
    {
      return pad(line);
    }).join("\n") + "\n\n";
  }

  function formatErrors (results) 
  {
    let failCount = results.fail.length;
    let past = (failCount === 1) ? "was" : "were";
    let plural = (failCount === 1) ? "failure" : "failures";
    let out = "\n" + pad(format.red.bold("Failed Tests:") 
      + " There " + past + " " 
      + format.red.bold(failCount) + " " + plural + "\n");
    out += formatFailedAssertions(results);

    return out;
  }

  function formatTotals (results) 
  {
    if (results.tests.length === 0) 
    {
      return pad(format.red(symbols.cross + " No tests found"));
    }
 
    const temp = [
      pad("total:     " + results.asserts.length),
      pad(format.green("passing:   " + results.pass.length)),
      results.fail.length > 0 ? 
        pad(format.red("failing:   " + results.fail.length)) : undefined,
        pad("duration:  " + prettyMs(new Date().getTime() - startTime))
    ];
    return temp.join("\n");
  }

  function formatFailedAssertions (results) 
  {
    let out = "";
    let groupedAssertions = results.fail.filter((assertion) =>
    {
      return assertion.test;
    });

    groupedAssertions.forEach((assertions, testNumber) =>
    {
      // Wrie failed assertion"s test name
      let test = results
        .tests.find(results.tests, {number: parseInt(testNumber)});
      out += "\n" + pad("  " + test.name + "\n\n");

      // Write failed assertion
      assertions.forEach((assertion) =>
      {
        out += pad("    " + format.red(symbols.cross) + " "
          + format.red(assertion.name)) + "\n";
      });

      out += "\n";
    });

    return out;
  }

  function pad (str) 
  {
    return "  " + str;
  }

  return stream;
};
