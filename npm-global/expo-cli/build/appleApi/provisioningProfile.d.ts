import { AppleCtx } from './authenticate';
import { DistCert, DistCertInfo } from './distributionCert';
export declare type ProvisioningProfileInfo = {
    name: string;
    status: string;
    expires: number;
    distributionMethod: string;
    certificates: DistCertInfo[];
} & ProvisioningProfile;
export declare type ProvisioningProfile = {
    provisioningProfileId?: string;
    provisioningProfile: string;
    teamId: string;
    teamName?: string;
};
export declare class ProvisioningProfileManager {
    ctx: AppleCtx;
    constructor(appleCtx: AppleCtx);
    useExisting<T extends DistCert>(bundleIdentifier: string, provisioningProfile: ProvisioningProfile, distCert: T): Promise<ProvisioningProfile>;
    list(bundleIdentifier: string): Promise<ProvisioningProfileInfo[]>;
    create<T extends DistCert>(bundleIdentifier: string, distCert: T, profileName: string): Promise<ProvisioningProfile>;
    revoke(bundleIdentifier: string): Promise<void>;
}
