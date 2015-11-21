'use strict';

const DataStore = require('./DataStore');
const fs = require('fs');
const MASK = '0777';
const IGNORED_MKDIR_ERROR = 'EEXIST';

/**
 * @fileOverview
 * Store using local filesystem.
 *
 * @author Ben Stahl <bhstahl@gmail.com>
 */

class FileStore extends DataStore {
    constructor(options) {
        super(options);

        this.directory = options.directory || options.path.replace(/^\//, '');

        this.extensions = ['creation', 'expiration'];
        this._checkOrCreateDirectory();
    }

    /**
     *  Ensure the directory exists.
     */
    _checkOrCreateDirectory() {
        fs.mkdir(this.directory, MASK, (error) => {
            if (error && error.code !== IGNORED_MKDIR_ERROR) {
                throw error;
            }

            console.log(`local FileStore synced to /${this.directory}`);
        });
    }

    /**
     * Create an empty file.
     *
     * @param  {File} file
     */
    create(file) {
        super.create(file);
        fs.closeSync(fs.openSync(`${this.directory}/${file.id}`, 'w'));
    }
}

module.exports = FileStore;