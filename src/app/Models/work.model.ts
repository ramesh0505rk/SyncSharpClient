export interface Work {
    WorkID: string;
    Title: string;
    Description: string
    Code: string;
    Language: string;
    CreatedBy: string;
    CreatedAt: Date;
    LastModified: Date;
}

export interface CreateWork {
    title: string;
    description: string;
    code: string;
    language: string;
    createdBy: string;
}

export interface UpdateWork {
    workID: string;
    code: string;
    language: string;
    modifiedBy: string;
}

export interface User {
    userID: string;
    username: string;
    email: string;
}

export interface WorkDetail extends Work {
    activeUsers: ActiveUser[];
}
export interface ActiveUser {
    userID: string;
    username: string;
    connectionID: string;
}