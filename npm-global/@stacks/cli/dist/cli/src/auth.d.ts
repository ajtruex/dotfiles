import * as express from 'express';
import { CLINetworkAdapter } from './network';
export declare const SIGNIN_CSS = "\nh1 { \n  font-family: monospace; \n  font-size: 24px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 26.4px; \n} \nh3 { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 15.4px; \n}\np { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 20px; \n}\nb {\n  background-color: #e8e8e8;\n}\npre { \n  font-family: monospace; \n  font-size: 13px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 18.5714px;\n}";
export declare const SIGNIN_HEADER: string;
export declare const SIGNIN_DESC = "<p>Sign-in request for <b>\"{appName}\"</b></p>";
export declare const SIGNIN_SCOPES = "<p>Requested scopes: <b>\"{appScopes}\"</b></p>";
export declare const SIGNIN_FMT_NAME = "<p><a href=\"{authRedirect}\">{blockstackID}</a> ({idAddress})</p>";
export declare const SIGNIN_FMT_ID = "<p><a href=\"{authRedirect}\">{idAddress}</a> (anonymous)</p>";
export declare const SIGNIN_FOOTER = "</body></html>";
export interface NamedIdentityType {
    name: string;
    idAddress: string;
    privateKey: string;
    index: number;
    profile: Object;
    profileUrl: string;
}
export declare function loadNamedIdentities(network: CLINetworkAdapter, mnemonic: string): Promise<Array<NamedIdentityType>>;
export declare function handleAuth(network: CLINetworkAdapter, mnemonic: string, gaiaHubUrl: string, profileGaiaHub: string, port: number, req: express.Request, res: express.Response): Promise<any>;
export declare function handleSignIn(network: CLINetworkAdapter, mnemonic: string, appGaiaHub: string, profileGaiaHub: string, req: express.Request, res: express.Response): Promise<any>;
