#!/usr/bin/env node
import * as fs from 'fs';
import * as rest from 'washswat-engine/lib/httpclient';
import { RestQueryInterface } from 'washswat-engine/lib/httpclient';

const { program } = require('commander');

program
  .description('swagger validator')
  .argument('<filename>', 'file to validate')
  .option('--yaml', 'Input data is yaml. Default is json')
  .option('--yamlout', 'Use output format as yaml. Default is json')
  .action(async (filename, options) => {
    const fileData = fs.readFileSync(filename).toString();

    let fileObject: any;
    if (options?.yaml) {
      fileObject = fileData;
    } else {
      fileObject = JSON.parse(fileData);
    }

    const query: RestQueryInterface = {
      body: fileObject,
      cacheTtl: 0,
      headers: {
        accept: options?.yamlout ? 'application/yaml' : 'application/json',
        'Content-Type': options?.yaml ? 'application/yaml' : 'application/json',
      },
      method: 'POST',
      params: undefined,
      retryConfig: {
        times: 1,
        interval: 100,
      },
      timeout: 10000,
      url: 'https://validator.swagger.io/validator/debug',
      useCache: false,
    };

    const result = await rest.call(query);

    if (result?.data) {
      // eslint-disable-next-line no-console
      console.log(result.data);
    }
  });

program.parse();
