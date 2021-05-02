// UPDATE BASED ON: https://github.com/cypress-io/github-action/pull/94/files

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");
const { request } = require("@octokit/request");

/**
 * Logs to the console
 */
const log = (msg) => console.log(`\n${msg}`); // eslint-disable-line no-console

/**
 * Exits the current process with an error code and message
 */
const exit = (msg) => {
	console.error(msg);
	process.exit(1);
};

/**
 * Executes the provided shell command and redirects stdout/stderr to the console
 */
const run = (cmd, cwd) => execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });

/**
 * Determines the current operating system (one of ["mac", "windows", "linux"])
 */
const getPlatform = () => {
	switch (process.platform) {
		case "darwin":
			return "mac";
		case "win32":
			return "windows";
		default:
			return "linux";
	}
};

/**
 * Returns the value for an environment variable (or `null` if it's not defined)
 */
const getEnv = (name) => process.env[name.toUpperCase()] || null;

/**
 * Sets the specified env variable if the value isn't empty
 */
const setEnv = (name, value) => {
	if (value) {
		process.env[name.toUpperCase()] = value.toString();
	}
};

/**
 * Returns the value for an input variable (or `null` if it's not defined). If the variable is
 * required and doesn't have a value, abort the action
 */
const getInput = (name, required) => {
	const value = getEnv(`INPUT_${name}`);
	if (required && !value) {
		exit(`"${name}" input variable is not defined`);
	}
	return value;
};

/**
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = async () => {
	const platform = getPlatform();
	const release = getInput("release", true) === "true";

	// The path to app's directory
	// (starts relative to Github action)
	const appDir = "app";
	const pkgRoot = path.resolve(__dirname + "../../../../" + appDir);

	const pkgJsonPath = path.join(pkgRoot, "package.json");
	// Make sure `package.json` file exists
	if (!existsSync(pkgJsonPath)) {
		exit(`\`package.json\` file not found at path "${pkgJsonPath}"`);
	}

	const pkgVersion = "v" + require(pkgJsonPath).version;
	console.info(`Using package.json from: ${pkgJsonPath}. Version: ${pkgVersion}`);

	// Copy "github_token" input variable to "GH_TOKEN" env variable (required by `electron-builder`)
	setEnv("GH_TOKEN", getInput("github_token", true));

	// Require code signing certificate and password if building for macOS. Export them to environment
	// variables (required by `electron-builder`)
	if (platform === "mac") {
		setEnv("CSC_LINK", getInput("mac_certs"));
		setEnv("CSC_KEY_PASSWORD", getInput("mac_certs_password"));
	} else if (platform === "windows") {
		setEnv("CSC_LINK", getInput("windows_certs"));
		setEnv("CSC_KEY_PASSWORD", getInput("windows_certs_password"));
	}

	// Disable console advertisements during install phase
	setEnv("ADBLOCK", true);

	// Check to see
	if (release) {
		// TODO Check if a draft release exists for the current package version
		// Try: https://github.com/octokit/request.js/
		// If not, cancel build

		// Check for a Release with a Git tag that matches the current package version
		const isExistingRelease = await checkForRelease(pkgVersion);

		if (isExistingRelease) {
			// TODO Check if release is draft status OR does not exist for the current version
			// TODO If is draft...
		} else {
			// TODO If no release exists for version, draft a new release
		}

		log(`Building and releasing the Electron app… \n`);

		if (platform === "mac") {
			log(`App will be codesigned and notarized \n`);
		}

		// Always publish to Github Release
		run(`yarn run build -- --publish always`, pkgRoot);
	} else {
		log(`Building the Electron app WITHOUT release… \n`);
		run(`yarn run build:fast -- --publish never`, pkgRoot);
	}
};

runAction();

async function checkForRelease(version) {
	log(`Checking if release exists already for ${version}… \n`);

	// Request
	const r = await request("GET /repos/reflex-app/reflex/releases", {
		headers: {
			authorization: `token ${getInput("github_token")}`,
		},
		org: "reflex-app",
		type: "private",
	});

	// List of the releases in JSON
	const { data: releases } = r;

	// Check for a Release with a Git tag that matches the current package version
	// i.e. "v0.7.0"
	// https://docs.github.com/en/rest/reference/repos#releases
	const isExistingRelease = releases.find((result) => result.tag_name === version);

	console.log(
		`${releases.length} releases found. ${
			isExistingRelease ? "Existing release found." : "No existing release found."
		}`,
	);

	// Returns either an obj {} (if true), or false
	return isExistingRelease;
}
