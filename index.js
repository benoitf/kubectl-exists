#!/usr/bin/env node

commandExists = require("command-exists");
var fs = require("fs");
var path = require("path");
var access = fs.access;
var accessSync = fs.accessSync;
var constants = fs.constants || fs;
var execSync = require("child_process").execSync;

console.log("node version:", process.version);
console.log("OS platform", process.platform);
console.log("OS arch", process.arch);

var cleanInput = function (s) {
  if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
    s = "'" + s.replace(/'/g, "'\\''") + "'";
    s = s
      .replace(/^(?:'')+/g, "") // unduplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s;
};

var fileNotExistsSync = function (commandName) {
  try {
    accessSync(commandName, constants.F_OK);
    return false;
  } catch (e) {
    return true;
  }
};

console.log("fileNotExistsSync =", fileNotExistsSync("kubectl"));

var localExecutableSync = function (commandName) {
  try {
    accessSync(commandName, constants.F_OK | constants.X_OK);
    return true;
  } catch (e) {
    return false;
  }
};

var commandExistsUnixSync = function (commandName, cleanedCommandName) {
  if (fileNotExistsSync(commandName)) {
    try {
      var commandLine =
        "command -v " +
        cleanedCommandName +
        " 2>/dev/null" +
        " && { echo >&1 " +
        cleanedCommandName +
        "; exit 0; }";
      console.log("commandLine is", commandLine);

      var stdout = execSync(commandLine);
      console.log("stdout=", stdout.toString());
      var res = !!stdout;
      console.log("commandExistsUnixSync: return", res);
      return res;
    } catch (error) {
      console.log("found error", error, "return false");
      return false;
    }
  }
  const localExecutableResult = localExecutableSync(commandName);
  console.log("localExecutableResult=", localExecutableResult);
};

var commandName = "kubectl";
var cleanedCommandName = cleanInput(commandName);
console.log("cleanedCommandName=", cleanedCommandName);
var result = commandExistsUnixSync(commandName, cleanedCommandName);

console.log("result of commandExistsUnixSync", result);

if (!commandExists.sync("kubectl")) {
  console.error("The command kubectl does not exists");
} else {
  console.info("Found kubectl command");
}
