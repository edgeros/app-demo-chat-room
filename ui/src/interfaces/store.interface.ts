import { IUser } from './auth.interface';

export interface IStoreState {
  srand: string;
  token: string;
  accountInfo: IUser; // 当前登录账号信息
}