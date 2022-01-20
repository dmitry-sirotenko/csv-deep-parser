const fs = require('fs');
const path = require('path');
const set = require('lodash/set');
const { parse } = require('@fast-csv/parse');

const headers = ['key', 'ru', 'en'];

const [file] = process.argv.slice(2);
const output = path.join(path.dirname(file), 'en.json');

const result = {};

fs.createReadStream(path.resolve(file))
    .pipe(parse({ headers, renameHeaders: true, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on('data', ({ key, en: value }) => set(result, key, value))
    .on('end', rowCount => {
        const content = JSON.stringify(result);

        fs.rmSync(output, { force: true });
        fs.writeFileSync(output, content, { encoding: 'utf-8' });

        console.log(`Parsed ${rowCount} rows and saved to ${output}`);
    });

