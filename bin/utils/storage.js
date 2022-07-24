const fs = require('fs');
const path = require('path');

const required = [
    {
        path: path.join(process.cwd(), './bin/data'),
        isDir: true,
        isReady: false,
    },
    {
        path: path.join(process.cwd(), './bin/data/.users'),
        isDir: false,
        isReady: false,
    },
    {
        path: path.join(process.cwd(), './bin/data/.projects'),
        isDir: false,
        isReady: false,
    }
];

const [data, users, projects] = required;

function initializeDirectory(path, index) {
    fs.mkdir(path, {recursive: true}, (error) => {
        if (error) {
            console.error('ERROR: Look at initializeDirectory() in bin/utils/initialize.js', error)
        } else {
            if (index) {
                required[index].isReady = true;
                initialize();
            }
        }
    })
}

function initializeFile(path, index) {
   fs.writeFile(path, JSON.stringify([]), 'utf-8', (error) => {
    if (error) {
        console.error('ERROR: Look at initializeFile() in bin/utils/initialize.js', error)
    } else {
        if (index) {
            required[index].isReady = true;
            initialize();
        }
    }
   })
}

function initialize () {
    for (const [index, item] of required.entries()) {
        const { path, isDir, isReady} = item;
        try {
            if (isReady) return;
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
        } catch (error) {
            if (isDir) initializeDirectory(path, index);
            if (!isDir) initializeFile(path, index);
        }
    }
}

function getFile (path, cb) {
    fs.readFile(path, 'utf-8', (error, data) => {
        if (error) throw error;
        const temp = data.toString();
        const parsed = JSON.parse(temp);
        cb(parsed);
    });
}

function setFile(path, data) {
    fs.writeFile(path, JSON.stringify(data), 'utf-8', (error) => {
        if (error) throw error;
    });
}

const Users = {
    get(cb) {
        getFile(users.path, cb);
    },
    set(data) {
        setFile(users.path, data);
    },
}

const Projects = {
    get(cb) {
        getFile(projects.path, cb);
    },
    set(data) {
        setFile(projects.path, data);
    }
}

module.exports = {
    initialize,
    Users,
    Projects
};
