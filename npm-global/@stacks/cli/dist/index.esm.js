import { CLIMain } from './cli.esm.js';
export { CLIMain } from './cli.esm.js';

var localStorageRAM = {};
global['window'] = {
  location: {
    origin: 'localhost'
  },
  localStorage: {
    getItem: function getItem(itemName) {
      return localStorageRAM[itemName];
    },
    setItem: function setItem(itemName, itemValue) {
      localStorageRAM[itemName] = itemValue;
    },
    removeItem: function removeItem(itemName) {
      delete localStorageRAM[itemName];
    }
  }
};
global['localStorage'] = global['window'].localStorage;
CLIMain();
//# sourceMappingURL=index.esm.js.map
