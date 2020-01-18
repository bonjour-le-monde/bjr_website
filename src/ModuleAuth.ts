import {Express} from 'express';

export interface IAuthenticator {
    readonly origin: string;

    configureRoutes(app: Express): void;
}

export class SerializedUser {
    readonly username : string;
    readonly userid : number;
    readonly avatar : string;
}