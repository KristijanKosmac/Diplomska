
export interface DoneResult {
    done: boolean;
}

export interface Dictionary<T> {
    [key: string]: T;
}

export interface MulterFiles {
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[]};
}

export interface Document extends AWS.S3.Object { 
    url: string;
}


