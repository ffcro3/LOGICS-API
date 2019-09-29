/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import fs from 'fs';

import child_process from 'child_process';

class FileController {
  /**
   * THIS ROUTE RECORDS ALL INJURIES FROM LOGICS
   */
  async compress(req, res) {
    const { folder } = req.params;

    console.log('Download route accessed');

    const compressedPath = `${resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      folder
    )}`;

    fs.unlink(`${compressedPath}/data_compressed.zip`, err => {
      if (err) {
        console.log('file not exists');
      }
    });

    const data = await child_process.execSync(`zip -r data_compressed *`, {
      cwd: `${compressedPath}`,
    });

    if (data) {
      console.log('File Compressed...');
      console.log('Begginig Download...');
    }

    return res
      .status(200)
      .download(`${compressedPath}/data_compressed.zip`, `${folder}.zip`);
  }
}

export default new FileController();
