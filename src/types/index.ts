export interface ConnectionConfig {
  name: string;
  hosts: string[];
  username?: string;
  password?: string;
  createdAt: number;
}

export interface KeyValue {
  key: string;
  value: string;
  version: number;
  createRevision: number;
  modRevision: number;
  lease: number;
}

export interface EtcdResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
