'use strict';

import os from 'os';

import FileSystemLoader from './css-modules/fileSystemLoader';

function cssModulesToFlow(tokens, indent = '  ') {
  const props = Object.keys(tokens)
    .sort()
    .map(key => `${indent}+'${key}': string;`)
    .join(os.EOL);

  return `/* This file is automatically generated by css-modules-flow-typed. */
// @flow
declare module.exports: {|
${props}
|};
`;
}

export default class Converter {
  constructor(rootDir) {
    this.loader = new FileSystemLoader(rootDir);
  }

  convert(filePath) {
    return new Promise((resolve, reject) => {
      // TODO: benchmark this (maybe this should only be cleared when watching)
      this.loader.tokensByFile = {};

      this.loader
        .fetch(filePath, '/', undefined, undefined)
        .then(res => {
          if (res) {
            const content = cssModulesToFlow(res);
            resolve(content);
          } else {
            reject(res);
          }
        })
        .catch(err => reject(err));
    });
  }
}
