#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const { initialize, Users } = require('./utils/storage.js');
const users = require('./utils/users.js');

initialize();


users.add({name: 'Miguel', password: '123klfjaslk1'}, (curr) => {
    console.log(curr)
});



