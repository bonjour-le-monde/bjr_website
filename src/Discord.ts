import { RestClient, IRestResponse } from 'typed-rest-client';
import { BearerCredentialHandler } from 'typed-rest-client/Handlers';

export class DiscordTokens
{
    constructor(
        public access_token: string,
        public refresh_token: string
    ) {}
}

export class DiscordUser  {
    constructor(
        public id: string, 
        public username: string,
        public avatar: string,
        public discriminator: string
    ) {}

    getCompleteName(): string {
        return `${this.username}#${this.discriminator}`;
    }
}

export class DiscordSession {
    public user : DiscordUser;
    public tokens : DiscordTokens;
}
export interface DiscordSessionMap {
    [id: string]: DiscordSession;
}

export namespace api 
{
    function make_rest(access_token: string) : RestClient
    {
        const bearer: BearerCredentialHandler = new BearerCredentialHandler(access_token);
        return new RestClient('nodejs (bjr_website, 1)', `${process.env.API_ENDPOINT}`, [bearer]);
    }
    export function usersMe(access_token: string) : Promise<IRestResponse<any>>
    {
        return make_rest(access_token).get(encodeURIComponent('/users/@me'));
    }
}