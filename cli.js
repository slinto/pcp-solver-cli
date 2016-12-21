#!/usr/bin/env node
'use strict';
const meow = require('meow');

const cli = meow(`
  Usage
    $ pcp <values>

  Options
    --depth <number> Set depth of three (30 DEFAULT)

  Examples
    $ node cli.js 010/0 00/100 11/01
    $ node cli.js 010/0 00/100 11/01 --depth 50
`);

let VALUES_LEFT = [];
let VALUES_RIGHT = [];
let VALUES_LENGTH = 0;
let MAX_DEPTH = 30;
let HAS_RESULT = false;

/**
 * Start string with another string?
 * @param a
 * @param b
 * @returns {boolean}
 */
let isStartWithStr = function (a, b) {
	return a.slice(0, b.length) === b || b.slice(0, a.length) === a;
};

/**
 * Compute Post Correspondence problem step.
 * @param a
 * @param b
 * @param depth
 * @param steps
 */
let pcpStep = function (a, b, depth, steps) {
	if (depth < MAX_DEPTH) {
		for (let i = 0; i < VALUES_LENGTH; i++) {
			let tempLeft = a.concat(VALUES_LEFT[i]);
			let tempRight = b.concat(VALUES_RIGHT[i]);

			if (tempLeft === tempRight) {
				let tempSteps = steps.concat(`-${i}`);
				HAS_RESULT = true;
				console.log(`Result found!\nStr A: \t${tempLeft}\nStr B: \t${tempRight}\nSteps: ${tempSteps}`);
				break;
			}

			if (isStartWithStr(tempLeft, tempRight)) {
				let currSteps = (steps.length === 0) ? steps.concat(i) : steps.concat(`-${i}`);
				pcpStep(tempLeft, tempRight, depth + 1, currSteps);
			}
		}
	}
};

/**
 * Prepare input values.
 * @param values
 */
let prepareValues = function (values) {
	values.forEach(value => {
		let splittedVals = value.split('/');
		VALUES_LEFT.push(splittedVals[0]);
		VALUES_RIGHT.push(splittedVals[1]);
	});

	if (VALUES_LEFT.length !== VALUES_RIGHT.length) {
		console.error(`Error: bad instructions.`);
		process.exit(1);
	}

	if (cli.flags.depth > 0) {
		MAX_DEPTH = cli.flags.depth;
	}

	VALUES_LENGTH = VALUES_LEFT.length;
};

if (cli.input.length === 0) {
	console.error(`Error: argument missing.`);
	process.exit(1);
} else {
	prepareValues(cli.input);
	pcpStep('', '', 0, '');

	if (!HAS_RESULT) {
		console.error(`Result was not found in max depth ${MAX_DEPTH}.`);
	}
}
