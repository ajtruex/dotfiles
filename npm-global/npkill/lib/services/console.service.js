"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@core/constants");
class ConsoleService {
    getParameters(rawArgv) {
        // This needs a refactor, but fck, is a urgent update
        const argvs = this.removeSystemArgvs(rawArgv);
        const options = {};
        argvs.map((argv, index) => {
            if (!this.isArgOption(argv) || !this.isValidOption(argv))
                return;
            const nextArgv = argvs[index + 1];
            const optionName = this.getOption(argv).name;
            options[optionName] = this.isArgHavingParams(nextArgv) ? nextArgv : true;
        });
        return options;
    }
    splitWordsByWidth(text, width) {
        const splitRegex = new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g');
        const splitText = this.replaceString(text, splitRegex, '$1\n');
        return this.splitData(splitText);
    }
    splitData(data, separator = '\n') {
        if (!data)
            return [];
        return data.split(separator);
    }
    replaceString(string, stringToReplace, replaceValue) {
        return string.replace(stringToReplace, replaceValue);
    }
    shortenText(text, width, startCut = 0) {
        if (!this.isValidShortenParams(text, width, startCut))
            return text;
        const startPartB = text.length - (width - startCut - constants_1.WIDTH_OVERFLOW.length);
        const partA = text.substring(startCut, -1);
        const partB = text.substring(startPartB, text.length);
        return partA + constants_1.WIDTH_OVERFLOW + partB;
    }
    isValidShortenParams(text, width, startCut) {
        return (startCut <= width &&
            text.length >= width &&
            !this.isNegative(width) &&
            !this.isNegative(startCut));
    }
    getValidArgvs(rawArgv) {
        const argvs = rawArgv.map((argv) => this.getOption(argv));
        return argvs.filter((argv) => argv);
    }
    removeSystemArgvs(allArgv) {
        return allArgv.slice(2);
    }
    isArgOption(argv) {
        return !!argv && argv.charAt(0) === '-';
    }
    isArgHavingParams(nextArgv) {
        return nextArgv && !this.isArgOption(nextArgv);
    }
    isValidOption(arg) {
        return constants_1.OPTIONS.some((option) => option.arg.includes(arg));
    }
    getOption(arg) {
        return constants_1.OPTIONS.find((option) => option.arg.includes(arg));
    }
    isNegative(numb) {
        return numb < 0;
    }
}
exports.ConsoleService = ConsoleService;
