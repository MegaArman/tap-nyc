#!/usr/bin/env node

let TapSpec = require("../");
let tapSpec = TapSpec();

process.stdin
  .pipe(tapSpec)
  .pipe(process.stdout);

process.on("exit", (status) =>
{  
  if (status === 1) 
  {
    process.exit(1);
  }
  
  if (tapSpec.failed) 
  {
    process.exit(1);
  }
});
