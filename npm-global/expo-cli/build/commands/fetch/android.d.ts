declare type Options = {
    parent?: {
        nonInteractive: boolean;
    };
};
export declare function fetchAndroidKeystoreAsync(projectDir: string, options: Options): Promise<void>;
export declare function fetchAndroidHashesAsync(projectDir: string, options: Options): Promise<void>;
export declare function fetchAndroidUploadCertAsync(projectDir: string, options: Options): Promise<void>;
export {};
