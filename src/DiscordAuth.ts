import { Express, Response, Request } from 'express';
import OAuth2Strategy = require("passport-oauth2");
import { RestClient, IRestResponse } from 'typed-rest-client';
import { BearerCredentialHandler } from 'typed-rest-client/Handlers';
import { IAuthenticator, SerializedUser } from "./ModuleAuth";
import { getRepository } from 'typeorm';

class DiscordTokens
{
    public access_token: string;
    public refresh_token: string;
}

class DiscordUser  {
    public tokens : DiscordTokens;
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

let users: any = {};

export class DiscordAuthenticator implements IAuthenticator {
    private _passport: any;

    readonly origin: string;
    
    constructor(passport: any) {
        this._passport = passport;
        this.origin = 'discord';
        let that: DiscordAuthenticator = this;
        console.log(`redirect_uri: ${encodeURIComponent(this.getCallbackURL())}`)
        let authorizationURL = `${process.env.API_ENDPOINT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(this.getCallbackURL())}&scope=identify`
        console.log(`url discord auth: ${authorizationURL}`)
        passport.use(this.origin, new OAuth2Strategy({
            authorizationURL: authorizationURL,
            tokenURL: `${process.env.API_ENDPOINT}/oauth2/token`,
            clientID: <string>process.env.CLIENT_ID,
            clientSecret: <string>process.env.CLIENT_SECRET,
            callbackURL: this.getCallbackURL(),
            state: true
        },
            async function (accessToken: string, refreshToken: string, profile: any, done: CallableFunction) {
                const bearer: BearerCredentialHandler = new BearerCredentialHandler(accessToken);
                const discord: RestClient = new RestClient('nodejs (bjr_website, 1)', `${process.env.API_ENDPOINT}`, [bearer]);
                const response: IRestResponse<any> = await discord.get(encodeURIComponent('/users/@me'));
                if (response.statusCode !== 200) {
                    return done(new Error(`Could not get discord user info. Got code ${response.statusCode}`));
                }
                const discordUser: DiscordUser = Object.assign(new DiscordUser('', '', '', ''), response.result);

                // const clientRepository = getRepository(Client);
                // let client: Client | undefined;
                // Des trucs avec des choses
                users[discordUser.id] = discordUser;
                return done(null, discordUser);
            })
        );
        
        passport.serializeUser(function(user, done) {
            console.log("serializeUser: ")
            console.log(user)
            done(null, user.id);
        });
        
        passport.deserializeUser(function(id, done) {
            
            if (users.hasOwnProperty(id))
                done(null, users[id]);
            else
                done("user not found", null);
            
        });
    }

    private getCallbackURL(): string {
        let callback = `${process.env.MY_URI}/auth/${this.origin}/callback`
        return callback;
    }

    public configureRoutes(app: Express): void {
        app.get(`/auth/${this.origin}`, this._passport.authenticate(this.origin));

        app.get(`/auth/${this.origin}/callback`, this._passport.authenticate(this.origin, {
            successRedirect: '/',
            failureRedirect: '/nologin'
        }));
    }

}