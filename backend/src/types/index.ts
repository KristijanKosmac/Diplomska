
export interface DoneResult {
    done: boolean;
}

export interface Dictionary<T> {
    [key: string]: T;
}

export interface MulterFiles {
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[]};
}

export interface File {
    filename: string;
    content: string | Buffer;
}   

export interface signInReponse {
    accessToken: string,
    profile: {
        id: string,
        email: string,
    },
    refreshToken: string,
}

export interface refreshTokenResponse {
    accessToken: string,
    refreshToken: string,
}