// Helpful script for bumping version
// via https://flaviocopes.com/node-input-from-cli/
const { spawn } = require("child_process");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const currVersion = getPackageVersion();
const types = ["major", "minor", "patch"];

readline.question(`What level of release? ${types}`, async (type) => {
  if (!types.includes(type)) return false;

  try {
    // Execute
    await runExec(`npm version ${type}`);
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }

  const newVersion = getPackageVersion();
  console.log(
    `Okay! Package.json bumped by ${type} from ${currVersion} to ${newVersion}`
  );
  readline.close();
});

// Run a child process
// https://stackoverflow.com/a/30168821/1114901
function runExec(fnString) {
  return new Promise((resolve, reject) => {
    const child = spawn(fnString, {
      encoding: "utf-8",
      shell: true,
      cwd: process.cwd(),
    });

    console.log(`Running ${fnString}`);

    child.stdout.on("data", (data) => {
      console.log("stdout: " + data.toString());
    });

    child.stderr.on("data", (data) => {
      console.log("CHILD PROCESS: " + data.toString());
    });

    child.on("error", function (err) {
      reject(new Error(err));
      errorHandler(err);
    });

    child.on("exit", function (code) {
      console.log("child process exited with code " + code.toString());
      resolve(true);
    });

    child.on("close", function (code) {
      console.log("child process exited with code " + code.toString());
      resolve(true);
    });
  });
}

// via https://stackoverflow.com/a/16060619/1114901
function getPackageVersion() {
  function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
  }

  const version = requireUncached("../package.json").version;
  return version;
}
