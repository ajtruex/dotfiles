#!/usr/bin/env node
const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const cheerio = require('cheerio');

const [,, ...args] = process.argv;
const url = args[0];

if (!url) {
  console.log(chalk.redBright('No URL Passed to Program'));
} else {
  axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const reqArr = _.map($('.image'), (i) => i.attribs.href);
      console.log(chalk.magentaBright($('#title').attr('title')));
      console.log(chalk.greenBright('Starting Download..'));
      let index = 0;
      function request() {
        const filetype = reqArr[index].split('.').pop();
        let filename = reqArr[index].slice(reqArr[index].lastIndexOf('/') + 1, reqArr[index].length);
        filename = filename.slice(0, filename.lastIndexOf('-'));
        return axios({
          method: 'GET',
          url: reqArr[index],
          responseType: 'stream',
        }).then((resp) => {
          console.log(`${chalk.cyanBright(`[${(index + 1).toString().padStart(reqArr.length.toString().length, '0')}/${reqArr.length}]`)} ${filename}.${filetype}`);
          resp.data.pipe(
            fs.createWriteStream(`${filename}.${filetype}`),
          );
          index += 1;
          if (index >= reqArr.length) {
            return console.log(chalk.greenBright('Download Completed!'));
          }
          return request();
        });
      }
      return request();
    })
    .catch((error) => {
      console.log(error);
    });
}
