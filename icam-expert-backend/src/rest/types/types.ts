import * as e from 'express';
import { Query } from 'express-serve-static-core';

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface PromptSettings {
  mineType: string;
  state: string;
  commodity: string;
}

export interface QueryParameters {
  toolName: string;
  settings: PromptSettings;
}
