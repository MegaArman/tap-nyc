#!/usr/bin/env node

let TapNyc = require("../");
let tapNyc = TapNyc();

process.stdin
  .pipe(tapNyc)
  .pipe(process.stdout);

process.on("exit", (status) =>
{  
  if (status === 1) 
  {
    process.exit(1);
  }
  
  if (tapNyc.failed) 
  {
    process.exit(1);
  }
});
