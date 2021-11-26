export interface config{
    production: configSettings,
    development: configSettings
}

export interface configSettings{
    secure: {
        jwt: string,
        aes: string
    }
    mongodb: string
}