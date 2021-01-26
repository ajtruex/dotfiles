"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const keypress = require("keypress");
const main_constants_1 = require("@core/constants/main.constants");
const cli_constants_1 = require("@core/constants/cli.constants");
const messages_constants_1 = require("@core/constants/messages.constants");
const rxjs_1 = require("rxjs");
const spinner_constants_1 = require("@core/constants/spinner.constants");
const operators_1 = require("rxjs/operators");
const sort_result_1 = require("./constants/sort.result");
const ansi_escapes_1 = require("ansi-escapes");
class Controller {
    constructor(fileService, spinnerService, consoleService, updateService, resultsService) {
        this.fileService = fileService;
        this.spinnerService = spinnerService;
        this.consoleService = consoleService;
        this.updateService = updateService;
        this.resultsService = resultsService;
        this.folderRoot = '';
        this.stdin = process.stdin;
        this.stdout = process.stdout;
        this.config = main_constants_1.DEFAULT_CONFIG;
        this.cursorPosY = main_constants_1.MARGINS.ROW_RESULTS_START;
        this.previusCursorPosY = main_constants_1.MARGINS.ROW_RESULTS_START;
        this.scroll = 0;
        this.finishSearching$ = new rxjs_1.Subject();
        this.KEYS = {
            up: this.moveCursorUp.bind(this),
            // tslint:disable-next-line: object-literal-sort-keys
            down: this.moveCursorDown.bind(this),
            space: this.delete.bind(this),
            j: this.moveCursorDown.bind(this),
            k: this.moveCursorUp.bind(this),
            execute(command, params) {
                return this[command](params);
            },
        };
        this.init();
    }
    init() {
        keypress(process.stdin);
        this.setErrorEvents();
        this.getArguments();
        this.prepareScreen();
        this.setupEventsListener();
        this.initializeLoadingStatus();
        if (this.config.checkUpdates)
            this.checkVersion();
        this.scan();
    }
    getArguments() {
        const options = this.consoleService.getParameters(process.argv);
        if (options['help']) {
            this.showHelp();
            process.exit();
        }
        if (options['version']) {
            this.showProgramVersion();
            process.exit();
        }
        if (options['delete-all']) {
            this.showObsoleteMessage();
            process.exit();
        }
        if (options['sort-by']) {
            if (!this.isValidSortParam(options['sort-by'])) {
                this.print(messages_constants_1.INFO_MSGS.NO_VALID_SORT_NAME);
                process.exit();
            }
            this.config.sortBy = options['sort-by'];
        }
        const exclude = options['exclude'];
        if (exclude && typeof exclude === 'string') {
            this.config.exclude = this.consoleService
                .splitData(this.consoleService.replaceString(exclude, '"', ''), ',')
                .map((file) => file.trim())
                .filter(Boolean);
        }
        this.folderRoot = options['directory']
            ? options['directory']
            : process.cwd();
        if (options['full-scan'])
            this.folderRoot = this.getUserHomePath();
        if (options['show-errors'])
            this.config.showErrors = true;
        if (options['gb'])
            this.config.folderSizeInGB = true;
        if (options['no-check-updates'])
            this.config.checkUpdates = false;
        if (options['target-folder'])
            this.config.targetFolder = options['target-folder'];
        if (options['bg-color'])
            this.setColor(options['bg-color']);
    }
    showHelp() {
        this.clear();
        this.print(colors.inverse(messages_constants_1.INFO_MSGS.HELP_TITLE + '\n\n'));
        let lineCount = 0;
        cli_constants_1.OPTIONS.map((option, index) => {
            this.printAtHelp(option.arg.reduce((text, arg) => text + ', ' + arg), {
                x: main_constants_1.UI_HELP.X_COMMAND_OFFSET,
                y: index + main_constants_1.UI_HELP.Y_OFFSET + lineCount,
            });
            const description = this.consoleService.splitWordsByWidth(option.description, this.stdout.columns - main_constants_1.UI_HELP.X_DESCRIPTION_OFFSET);
            description.map((line) => {
                this.printAtHelp(line, {
                    x: main_constants_1.UI_HELP.X_DESCRIPTION_OFFSET,
                    y: index + main_constants_1.UI_HELP.Y_OFFSET + lineCount,
                });
                ++lineCount;
            });
        });
        this.printAt('', {
            x: 0,
            y: lineCount * 2 + 2,
        });
    }
    showProgramVersion() {
        this.print('v' + this.getVersion());
    }
    showObsoleteMessage() {
        this.print(messages_constants_1.INFO_MSGS.DISABLED);
    }
    setColor(color) {
        if (this.isValidColor(color))
            this.config.backgroundColor = cli_constants_1.COLORS[color];
    }
    isValidColor(color) {
        return Object.keys(cli_constants_1.COLORS).some((validColor) => validColor === color);
    }
    isValidSortParam(sortName) {
        return Object.keys(sort_result_1.FOLDER_SORT).includes(sortName);
    }
    getVersion() {
        const packageJson = __dirname + '/../package.json';
        const packageData = JSON.parse(this.fileService.getFileContent(packageJson));
        return packageData.version;
    }
    clear() {
        this.print(ansi_escapes_1.default.clearTerminal);
    }
    print(text) {
        process.stdout.write.bind(process.stdout)(text);
    }
    prepareScreen() {
        this.checkScreenRequirements();
        this.setRawMode();
        this.clear();
        this.printUI();
        this.hideCursor();
    }
    checkScreenRequirements() {
        if (this.isTerminalTooSmall()) {
            this.print(messages_constants_1.INFO_MSGS.MIN_CLI_CLOMUNS);
            process.exit();
        }
        if (!this.stdout.isTTY) {
            this.print(messages_constants_1.INFO_MSGS.NO_TTY);
            process.exit();
        }
    }
    checkVersion() {
        this.updateService
            .isUpdated(this.getVersion())
            .then((isUpdated) => {
            if (!isUpdated)
                this.showNewInfoMessage();
        })
            .catch((err) => {
            const errorMessage = messages_constants_1.ERROR_MSG.CANT_GET_REMOTE_VERSION + ': ' + err.message;
            this.printError(errorMessage);
        });
    }
    showNewInfoMessage() {
        const message = colors.magenta(messages_constants_1.INFO_MSGS.NEW_UPDATE_FOUND);
        this.printAt(message, main_constants_1.UI_POSITIONS.NEW_UPDATE_FOUND);
    }
    isTerminalTooSmall() {
        return this.stdout.columns <= main_constants_1.MIN_CLI_COLUMNS_SIZE;
    }
    setRawMode(set = true) {
        this.stdin.setRawMode(set);
        process.stdin.resume();
    }
    printUI() {
        ///////////////////////////
        // banner and tutorial
        this.printAt(main_constants_1.BANNER, main_constants_1.UI_POSITIONS.INITIAL);
        this.printAt(colors.yellow(colors.inverse(messages_constants_1.HELP_MSGS.BASIC_USAGE)), main_constants_1.UI_POSITIONS.TUTORIAL_TIP);
        ///////////////////////////
        // folder size header
        this.printAt(colors.gray(messages_constants_1.INFO_MSGS.HEADER_SIZE_COLUMN), {
            x: this.stdout.columns -
                (main_constants_1.MARGINS.FOLDER_SIZE_COLUMN +
                    Math.round(messages_constants_1.INFO_MSGS.HEADER_SIZE_COLUMN.length / 5)),
            y: main_constants_1.UI_POSITIONS.FOLDER_SIZE_HEADER.y,
        });
        ///////////////////////////
        // npkill stats
        this.printAt(colors.gray(messages_constants_1.INFO_MSGS.TOTAL_SPACE + main_constants_1.DEFAULT_SIZE), main_constants_1.UI_POSITIONS.TOTAL_SPACE);
        this.printAt(colors.gray(messages_constants_1.INFO_MSGS.SPACE_RELEASED + main_constants_1.DEFAULT_SIZE), main_constants_1.UI_POSITIONS.SPACE_RELEASED);
    }
    printAt(message, position) {
        this.setCursorAt(position);
        this.print(message);
    }
    setCursorAt({ x, y }) {
        this.print(ansi_escapes_1.default.cursorTo(x, y));
    }
    printAtHelp(message, position) {
        this.setCursorAtHelp(position);
        this.print(message);
        if (!/-[a-zA-Z]/.test(message.substring(0, 2)) && message !== '') {
            this.print('\n\n');
        }
    }
    setCursorAtHelp({ x, y }) {
        this.print(ansi_escapes_1.default.cursorTo(x));
    }
    initializeLoadingStatus() {
        this.spinnerService.setSpinner(spinner_constants_1.SPINNERS.W10);
        rxjs_1.interval(spinner_constants_1.SPINNER_INTERVAL)
            .pipe(operators_1.takeUntil(this.finishSearching$))
            .subscribe(() => this.updateStatus(messages_constants_1.INFO_MSGS.SEARCHING + this.spinnerService.nextFrame()), (error) => this.printError(error));
    }
    updateStatus(text) {
        this.printAt(text, main_constants_1.UI_POSITIONS.STATUS);
    }
    printFoldersSection() {
        const visibleFolders = this.getVisibleScrollFolders();
        this.clearLine(this.previusCursorPosY);
        visibleFolders.map((folder, index) => {
            const folderRow = main_constants_1.MARGINS.ROW_RESULTS_START + index;
            this.printFolderRow(folder, folderRow);
        });
    }
    printFolderRow(folder, row) {
        let { path, size } = this.getFolderTexts(folder);
        if (row === this.getRealCursorPosY()) {
            path = colors[this.config.backgroundColor](path);
            size = colors[this.config.backgroundColor](size);
            this.paintBgRow(row);
        }
        this.printAt(path, {
            x: main_constants_1.MARGINS.FOLDER_COLUMN_START,
            y: row,
        });
        this.printAt(size, {
            x: this.stdout.columns - main_constants_1.MARGINS.FOLDER_SIZE_COLUMN,
            y: row,
        });
    }
    getFolderTexts(folder) {
        const folderText = this.getFolderPathText(folder);
        let folderSize = `${folder.size.toFixed(main_constants_1.DECIMALS_SIZE)} GB`;
        if (!this.config.folderSizeInGB) {
            const size = this.fileService.convertGBToMB(folder.size);
            folderSize = `${size.toFixed(main_constants_1.DECIMALS_SIZE)} MB`;
        }
        const folderSizeText = folder.size ? folderSize : '--';
        return {
            path: folderText,
            size: folderSizeText,
        };
    }
    paintBgRow(row) {
        const startPaint = main_constants_1.MARGINS.FOLDER_COLUMN_START;
        const endPaint = this.stdout.columns - main_constants_1.MARGINS.FOLDER_SIZE_COLUMN;
        let paintSpaces = '';
        for (let i = startPaint; i < endPaint; ++i) {
            paintSpaces += ' ';
        }
        this.printAt(colors[this.config.backgroundColor](paintSpaces), {
            x: startPaint,
            y: row,
        });
    }
    getFolderPathText(folder) {
        let cutFrom = main_constants_1.OVERFLOW_CUT_FROM;
        let text = folder.path;
        const ACTIONS = {
            // tslint:disable-next-line: object-literal-key-quotes
            deleted: () => {
                cutFrom += messages_constants_1.INFO_MSGS.DELETED_FOLDER.length;
                text = messages_constants_1.INFO_MSGS.DELETED_FOLDER + text;
            },
            // tslint:disable-next-line: object-literal-key-quotes
            deleting: () => {
                cutFrom += messages_constants_1.INFO_MSGS.DELETING_FOLDER.length;
                text = messages_constants_1.INFO_MSGS.DELETING_FOLDER + text;
            },
            'error-deleting': () => {
                cutFrom += messages_constants_1.INFO_MSGS.ERROR_DELETING_FOLDER.length;
                text = messages_constants_1.INFO_MSGS.ERROR_DELETING_FOLDER + text;
            },
        };
        if (ACTIONS[folder.status])
            ACTIONS[folder.status]();
        text = this.consoleService.shortenText(text, this.stdout.columns - main_constants_1.MARGINS.FOLDER_COLUMN_END, cutFrom);
        // This is necessary for the coloring of the text, since
        // the shortener takes into ansi-scape codes invisible
        // characters and can cause an error in the cli.
        text = this.paintStatusFolderPath(text, folder.status);
        return text;
    }
    paintStatusFolderPath(folderString, action) {
        const TRANSFORMATIONS = {
            // tslint:disable-next-line: object-literal-key-quotes
            deleted: (text) => text.replace(messages_constants_1.INFO_MSGS.DELETED_FOLDER, colors.green(messages_constants_1.INFO_MSGS.DELETED_FOLDER)),
            // tslint:disable-next-line: object-literal-key-quotes
            deleting: (text) => text.replace(messages_constants_1.INFO_MSGS.DELETING_FOLDER, colors.yellow(messages_constants_1.INFO_MSGS.DELETING_FOLDER)),
            'error-deleting': (text) => text.replace(messages_constants_1.INFO_MSGS.ERROR_DELETING_FOLDER, colors.red(messages_constants_1.INFO_MSGS.ERROR_DELETING_FOLDER)),
        };
        return TRANSFORMATIONS[action]
            ? TRANSFORMATIONS[action](folderString)
            : folderString;
    }
    clearFolderSection() {
        for (let row = main_constants_1.MARGINS.ROW_RESULTS_START; row < this.stdout.rows; row++) {
            this.clearLine(row);
        }
    }
    setupEventsListener() {
        this.stdin.on('keypress', (ch, key) => {
            if (key && key['name'])
                this.keyPress(key);
        });
        this.stdout.on('resize', () => {
            this.clear();
            this.printUI();
            this.printStats();
            this.printFoldersSection();
        });
    }
    keyPress(key) {
        const { name, ctrl } = key;
        if (this.isQuitKey(ctrl, name))
            this.quit();
        const command = this.getCommand(name);
        if (command)
            this.KEYS.execute(name);
        this.printFoldersSection();
    }
    setErrorEvents() {
        process.on('uncaughtException', (err) => {
            this.printError(err.message);
        });
        process.on('unhandledRejection', (reason) => {
            this.printError(reason['stack']);
        });
    }
    hideCursor() {
        this.print(ansi_escapes_1.default.cursorHide);
    }
    showCursor() {
        this.print(ansi_escapes_1.default.cursorShow);
    }
    scan() {
        const params = this.prepareListDirParams();
        const folders$ = this.fileService.listDir(params);
        folders$
            .pipe(operators_1.catchError((error, caught) => {
            if (error.bash) {
                this.printFolderError(error.message);
                return caught;
            }
            throw error;
        }), operators_1.mergeMap((dataFolder) => rxjs_1.from(this.consoleService.splitData(dataFolder.toString()))), operators_1.filter((path) => !!path), operators_1.map((path) => ({ path, size: 0, status: 'live' })), operators_1.tap((nodeFolder) => {
            this.resultsService.addResult(nodeFolder);
            if (this.config.sortBy === 'path') {
                this.resultsService.sortResults(this.config.sortBy);
                this.clearFolderSection();
            }
        }), operators_1.mergeMap((nodeFolder) => this.calculateFolderStats(nodeFolder), 4))
            .subscribe(() => this.printFoldersSection(), (error) => this.printError(error), () => this.completeSearch());
    }
    prepareListDirParams() {
        const target = this.config.targetFolder;
        const params = {
            path: this.folderRoot,
            target,
        };
        if (this.config.exclude.length > 0) {
            params['exclude'] = this.config.exclude;
        }
        return params;
    }
    printFolderError(err) {
        if (!this.config.showErrors)
            return;
        const messages = this.consoleService.splitData(err);
        messages.map((msg) => this.printError(msg));
    }
    calculateFolderStats(nodeFolder) {
        return this.fileService
            .getFolderSize(nodeFolder.path)
            .pipe(operators_1.tap((size) => this.finishFolderStats(nodeFolder, size)));
    }
    finishFolderStats(folder, size) {
        folder.size = this.transformFolderSize(size);
        if (this.config.sortBy === 'size') {
            this.resultsService.sortResults(this.config.sortBy);
            this.clearFolderSection();
        }
        this.printStats();
        this.printFoldersSection();
    }
    transformFolderSize(size) {
        return this.fileService.convertKbToGB(+size);
    }
    completeSearch() {
        this.finishSearching$.next(true);
        this.updateStatus(colors.green(messages_constants_1.INFO_MSGS.SEARCH_COMPLETED));
    }
    isQuitKey(ctrl, name) {
        return (ctrl && name === 'c') || name === 'q' || name === 'escape';
    }
    quit() {
        this.setRawMode(false);
        this.clear();
        this.printExitMessage();
        this.showCursor();
        process.exit();
    }
    printExitMessage() {
        const { spaceReleased } = this.resultsService.getStats();
        const exitMessage = `Space released: ${spaceReleased}\n`;
        this.print(exitMessage);
    }
    getCommand(keyName) {
        return main_constants_1.VALID_KEYS.find((name) => name === keyName);
    }
    isCursorInLowerTextLimit(positionY) {
        const foldersAmmount = this.resultsService.results.length;
        return positionY < foldersAmmount - 1 + main_constants_1.MARGINS.ROW_RESULTS_START;
    }
    isCursorInUpperTextLimit(positionY) {
        return positionY > main_constants_1.MARGINS.ROW_RESULTS_START;
    }
    moveCursorUp() {
        if (this.isCursorInUpperTextLimit(this.cursorPosY)) {
            this.previusCursorPosY = this.getRealCursorPosY();
            this.cursorPosY--;
            this.checkCursorScroll();
        }
    }
    moveCursorDown() {
        if (this.isCursorInLowerTextLimit(this.cursorPosY)) {
            this.previusCursorPosY = this.getRealCursorPosY();
            this.cursorPosY++;
            this.checkCursorScroll();
        }
    }
    checkCursorScroll() {
        if (this.cursorPosY < main_constants_1.MARGINS.ROW_RESULTS_START + this.scroll)
            this.scrollFolderResults(-1);
        if (this.cursorPosY > this.stdout.rows + this.scroll - 1)
            this.scrollFolderResults(1);
    }
    scrollFolderResults(scrollAmount) {
        this.scroll += scrollAmount;
        this.clearFolderSection();
    }
    delete() {
        const nodeFolder = this.resultsService.results[this.cursorPosY - main_constants_1.MARGINS.ROW_RESULTS_START];
        this.clearErrors();
        this.deleteFolder(nodeFolder);
    }
    deleteFolder(folder) {
        const isSafeToDelete = this.fileService.isSafeToDelete(folder.path, this.config.targetFolder);
        if (!isSafeToDelete) {
            this.printError('Folder not safe to delete');
            return;
        }
        folder.status = 'deleting';
        this.fileService
            .deleteDir(folder.path)
            .then(() => {
            folder.status = 'deleted';
            this.printStats();
            this.printFoldersSection();
        })
            .catch(() => {
            folder.status = 'error-deleting';
            this.printFoldersSection();
            this.printError(messages_constants_1.ERROR_MSG.CANT_DELETE_FOLDER);
        });
    }
    printError(error) {
        const errorText = this.prepareErrorMsg(error);
        this.printAt(colors.red(errorText), {
            x: 0,
            y: this.stdout.rows,
        });
    }
    prepareErrorMsg(errMessage) {
        const margin = main_constants_1.MARGINS.FOLDER_COLUMN_START;
        const width = this.stdout.columns - margin - 3;
        return this.consoleService.shortenText(errMessage, width, width);
    }
    printStats() {
        const { totalSpace, spaceReleased } = this.resultsService.getStats();
        const totalSpacePosition = Object.assign({}, main_constants_1.UI_POSITIONS.TOTAL_SPACE);
        const spaceReleasedPosition = Object.assign({}, main_constants_1.UI_POSITIONS.SPACE_RELEASED);
        totalSpacePosition.x += messages_constants_1.INFO_MSGS.TOTAL_SPACE.length;
        spaceReleasedPosition.x += messages_constants_1.INFO_MSGS.SPACE_RELEASED.length;
        this.printAt(totalSpace, totalSpacePosition);
        this.printAt(spaceReleased, spaceReleasedPosition);
    }
    getVisibleScrollFolders() {
        return this.resultsService.results.slice(this.scroll, this.stdout.rows - main_constants_1.MARGINS.ROW_RESULTS_START + this.scroll);
    }
    getRealCursorPosY() {
        return this.cursorPosY - this.scroll;
    }
    clearErrors() {
        const lineOfErrors = this.stdout.rows;
        this.clearLine(lineOfErrors);
    }
    clearLine(row) {
        this.printAt(ansi_escapes_1.default.eraseLine, { x: 0, y: row });
    }
    getUserHomePath() {
        return require('os').homedir();
    }
}
exports.Controller = Controller;
