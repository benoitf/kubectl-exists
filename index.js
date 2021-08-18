#!/usr/bin/env node

commandExists = require("command-exists");

console.log("node version:", process.version);
console.log("OS platform", process.platform);
console.log("OS arch", process.arch);

if (!commandExists.sync("kubectl")) {
  console.error("The command kubectl does not exists");
} else {
  console.info("Found kubectl command");
}
