const inquirer = require('inquirer');
const generateInterface = require('../lib/api2code/generateInterface');
const generateCRUD = require('../lib/api2code/generateCRUD');
const loadConfig = require('../lib/loadConfig');

const config = loadConfig();

const handleTargetMap = {
  interface: generateInterface,
  CRUD: generateCRUD,
};

const promptList = [
  {
    type: 'list',
    name: 'target',
    message: 'Please select the type of generation.',
    choices: Object.keys(handleTargetMap),
  },
];

const chooseHttpMethod = {
  type: 'list',
  name: 'httpMethod',
  message: 'Please choose your HTTP method.',
  choices: ['GET', 'POST', 'PUT', 'DELETE'],
};

const api2code = program => {
  program
    .command('api2code')
    .alias('a2c')
    .description('🌽 api translation typescript')

    .option('-u, --url <url>', 'api addres(domain or ip)', config.url)
    .option('-p, --path <path>', 'api path')
    .option('-b, --body <body>', '')

    .option('-i, --input <input>', 'input json file')
    .requiredOption('-o, --output <output>', 'path of generation file')
    .action(options => {
      const { url, output, path } = options;

      path && promptList.push(chooseHttpMethod);

      inquirer.prompt(promptList).then(({ target, httpMethod }) => {
        handleTargetMap[target]({ url, path, output, httpMethod });
      });
    });
};
module.exports = api2code;