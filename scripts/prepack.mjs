import pjson from '../package.json' assert {type: 'json'};
import * as fs from 'node:fs/promises';

const minimalPjson = {...pjson};
// Removes unnecessary entries since
// devDependencies are installed with
// @oclif/plugin-plugins versions older
// than 5.0.5
delete minimalPjson.devDependencies;
delete minimalPjson.scripts;
delete minimalPjson.files;
minimalPjson.oclif.commands = './commands';

const fh = await fs.open('./dist/package.json', 'a+')
await fh.writeFile(JSON.stringify(minimalPjson, null, 2))
