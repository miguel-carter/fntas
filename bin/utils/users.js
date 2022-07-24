const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Users } = require('./storage');

function objectWithPropExist (arr, prop, value) {
    if (arr.filter((i) => i[prop] == value).length) {
        return true
    } else {
        return false
    }
}

function add ({name, password}, cb) {
    Users.get((curr) => {
        if(objectWithPropExist(curr, 'name', name.toLowerCase())) {
            throw new Error('User already exist!');
        } else {
            const temp = [...curr];
            bcrypt.hash(password, saltRounds, ((error, hash) => {
                if (error) throw new Error('Something went wrong while saving user');
                temp.push({name: name.toLowerCase(), password: hash});
                Users.set(temp);
                if (cb) cb(temp);
            }))
        }
    })
}

function list (cb) {
    Users.get((curr) => {
        let names = curr.map((c) => c.name);
        if (cb) cb(names);
    })
}

module.exports = {
    list,
    add
}