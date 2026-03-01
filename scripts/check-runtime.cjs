#!/usr/bin/env node

const REQUIRED_NODE_MAJOR = 24
const REQUIRED_NPM = "11.6.2"

function fail(message) {
  console.error(`\nRuntime requirement failed: ${message}`)
  console.error(`Required: Node ${REQUIRED_NODE_MAJOR}.x and npm ${REQUIRED_NPM}\n`)
  process.exit(1)
}

const nodeVersion = process.versions.node
const nodeMajor = Number(nodeVersion.split(".")[0])

if (nodeMajor !== REQUIRED_NODE_MAJOR) {
  fail(`Detected Node ${nodeVersion}`)
}

const userAgent = process.env.npm_config_user_agent || ""
const npmMatch = userAgent.match(/npm\/([0-9.]+)/)
const npmVersion = npmMatch ? npmMatch[1] : null

if (!npmVersion) {
  fail("Could not detect npm version. Run scripts with npm.")
}

if (npmVersion !== REQUIRED_NPM) {
  fail(`Detected npm ${npmVersion}`)
}
