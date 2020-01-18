import { Express, Response, Request } from 'express';
import OAuth2Strategy = require("passport-oauth2");
import { RestClient, IRestResponse } from 'typed-rest-client';
import { BearerCredentialHandler } from 'typed-rest-client/Handlers';
import { IAuthenticator, SerializedUser } from "./ModuleAuth";
import { getRepository } from 'typeorm';

class DiscordUser  {
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

export class DiscordAuthenticator implements IAuthenticator {
    private _passport: any;

    readonly origin: string;
    
    constructor(passport: any) {
        this._passport = passport;
        this.origin = 'discord';
        let that: DiscordAuthenticator = this;
        passport.use(this.origin, new OAuth2Strategy({
            authorizationURL: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENTID}&response_type=code&state=werewolfinthesnow5&redirect_uri=${encodeURIComponent(this.getCallbackURL())}&duration=permanent&scope=identify`,
            tokenURL: 'https://discordapp.com/api/oauth2/token',
            clientID: <string>process.env.DISCORD_CLIENTID,
            clientSecret: <string>process.env.DISCORD_SECRET,
            callbackURL: this.getCallbackURL()
        },
            async function (accessToken: string, refreshToken: string, profile: any, done: CallableFunction) {
                const bearer: BearerCredentialHandler = new BearerCredentialHandler(accessToken);
                const discord: RestClient = new RestClient('nyx (http://github.com/tym17, 1)', 'https://discordapp.com/api', [bearer]);
                const response: IRestResponse<any> = await discord.get(encodeURIComponent('/users/@me'));
                if (response.statusCode !== 200) {
                    return done(new Error(`Could not get discord user info. Got code ${response.statusCode}`));
                }
                const discordUser: DiscordUser = Object.assign(new DiscordUser('', '', '', ''), response.result);

                // const clientRepository = getRepository(Client);
                // let client: Client | undefined;
                // Des trucs avec des choses
                return done(null, discordUser);
            })
        );
    }

    private getCallbackURL(): string {
        return `${process.env.MY_URI}/auth/${this.origin}/callback`;
    }

    public configureRoutes(app: Express): void {
        app.get(`/auth/${this.origin}`, this._passport.authenticate(this.origin));

        app.get(`/auth/${this.origin}/callback`, this._passport.authenticate(this.origin, {
            successRedirect: '/link',
            failureRedirect: '/nologin'
        }));
    }

}