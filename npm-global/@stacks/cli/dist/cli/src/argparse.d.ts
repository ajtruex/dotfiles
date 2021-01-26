export declare const NAME_PATTERN = "^([0-9a-z_.+-]{3,37})$";
export declare const NAMESPACE_PATTERN = "^([0-9a-z_-]{1,19})$";
export declare const ADDRESS_CHARS = "[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1,35}";
export declare const C32_ADDRESS_CHARS = "[0123456789ABCDEFGHJKMNPQRSTVWXYZ]+";
export declare const ADDRESS_PATTERN: string;
export declare const ID_ADDRESS_PATTERN: string;
export declare const STACKS_ADDRESS_PATTERN: string;
export declare const PRIVATE_KEY_PATTERN = "^([0-9a-f]{64,66})$";
export declare const PRIVATE_KEY_UNCOMPRESSED_PATTERN = "^([0-9a-f]{64})$";
export declare const PRIVATE_KEY_NOSIGN_PATTERN: string;
export declare const PRIVATE_KEY_MULTISIG_PATTERN = "^([0-9]+),([0-9a-f]{64,66},)*([0-9a-f]{64,66})$";
export declare const PRIVATE_KEY_SEGWIT_P2SH_PATTERN = "^segwit:p2sh:([0-9]+),([0-9a-f]{64,66},)*([0-9a-f]{64,66})$";
export declare const PRIVATE_KEY_PATTERN_ANY: string;
export declare const PUBLIC_KEY_PATTERN = "^([0-9a-f]{66,130})$";
export declare const INT_PATTERN = "^-?[0-9]+$";
export declare const ZONEFILE_HASH_PATTERN = "^([0-9a-f]{40})$";
export declare const URL_PATTERN = "^http[s]?://.+$";
export declare const SUBDOMAIN_PATTERN = "^([0-9a-z_+-]{1,37}).([0-9a-z_.+-]{3,37})$";
export declare const TXID_PATTERN = "^([0-9a-f]{64})$";
export declare const BOOLEAN_PATTERN = "^(0|1|true|false)$";
export interface CLI_LOG_CONFIG_TYPE {
    level: string;
    handleExceptions: boolean;
    timestamp: boolean;
    stringify: boolean;
    colorize: boolean;
    json: boolean;
}
export interface CLI_CONFIG_TYPE {
    blockstackAPIUrl: string;
    blockstackNodeUrl: string;
    broadcastServiceUrl: string;
    utxoServiceUrl: string;
    logConfig: CLI_LOG_CONFIG_TYPE;
    bitcoindUsername?: string;
    bitcoindPassword?: string;
}
export declare const DEFAULT_CONFIG_PATH = "~/.blockstack-cli.conf";
export declare const DEFAULT_CONFIG_REGTEST_PATH = "~/.blockstack-cli-regtest.conf";
export declare const DEFAULT_CONFIG_TESTNET_PATH = "~/.blockstack-cli-testnet.conf";
export declare const DEFAULT_MAX_ID_SEARCH_INDEX = 256;
interface CLI_PROP_ITEM {
    name: string;
    type: 'string';
    realtype: string;
    pattern?: string;
}
interface CLI_PROP {
    [index: string]: {
        type: 'array';
        items: CLI_PROP_ITEM[];
        minItems: number;
        maxItems: number;
        help: string;
        group: string;
    };
}
export declare const CLI_ARGS: {
    type: string;
    properties: CLI_PROP;
    additionalProperties: boolean;
    strict: boolean;
};
export declare const USAGE: string;
export declare function makeAllCommandsList(): string;
export declare function makeAllCommandsHelp(): string;
export declare function makeCommandUsageString(command?: string): string;
export declare function makeUsageString(): string;
export declare function printUsage(): void;
interface CLI_OPTS {
    [index: string]: null | boolean | string | string[];
}
export declare function getCLIOpts(argv: string[], opts?: string): CLI_OPTS;
export declare function CLIOptAsString(opts: CLI_OPTS, key: string): string | null;
export declare function CLIOptAsBool(opts: CLI_OPTS, key: string): boolean;
export declare function CLIOptAsStringArray(opts: CLI_OPTS, key: string): string[] | null;
export declare function getCommandArgs(command: string, argsList: Array<string>): {
    status: boolean;
    error: string;
    arguments?: undefined;
} | {
    status: boolean;
    arguments: string[];
    error?: undefined;
};
export interface CheckArgsSuccessType {
    success: true;
    command: string;
    args: Array<string>;
}
export interface CheckArgsFailType {
    success: false;
    error: string;
    command: string;
    usage: boolean;
}
export declare function checkArgs(argList: Array<string>): CheckArgsSuccessType | CheckArgsFailType;
export declare function loadConfig(configFile: string, networkType: string): CLI_CONFIG_TYPE;
export {};
