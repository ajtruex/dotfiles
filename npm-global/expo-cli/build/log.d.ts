import chalk from 'chalk';
import { Ora } from 'ora';
import terminalLink from 'terminal-link';
declare function log(...args: any[]): void;
declare namespace log {
    var nested: (message: any) => void;
    var newLine: () => void;
    var addNewLineIfNone: () => void;
    var printNewLineBeforeNextLog: () => void;
    var setBundleProgressBar: (bar: any) => void;
    var setSpinner: (oraSpinner: Ora | null) => void;
    var error: (...args: any[]) => void;
    var nestedError: (message: string) => void;
    var warn: (...args: any[]) => void;
    var nestedWarn: (message: string) => void;
    var gray: (...args: any[]) => void;
    var chalk: chalk.Chalk & chalk.ChalkFunction & {
        supportsColor: false | chalk.ColorSupport;
        Level: chalk.Level;
        Color: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright" | "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        ForegroundColor: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
        BackgroundColor: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        Modifiers: "hidden" | "bold" | "italic" | "underline" | "reset" | "dim" | "inverse" | "strikethrough" | "visible";
        stderr: chalk.Chalk & {
            supportsColor: false | chalk.ColorSupport;
        };
    };
    var terminalLink: {
        (text: string, url: string, options?: terminalLink.Options | undefined): string;
        readonly isSupported: boolean;
        readonly stderr: {
            (text: string, url: string, options?: terminalLink.Options | undefined): string;
            readonly isSupported: boolean;
        };
    };
}
export default log;
