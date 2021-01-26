export declare function getMaxIDSearchIndex(): number;
export interface WhoisInfoType {
    address: string;
    blockchain: string;
    block_renewed_at: number;
    did: string;
    expire_block: number;
    grace_period: number;
    last_transaction_height: number;
    last_txid: string;
    owner_address: string;
    owner_script: string;
    renewal_deadline: number;
    resolver: string | null;
    status: string;
    zonefile: string | null;
    zonefile_hash: string | null;
}
export declare function CLIMain(): void;
