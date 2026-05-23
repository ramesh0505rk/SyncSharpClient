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

export interface WorkDetail extends Work {
    activeUsers: ActiveUser[];
}
export interface ActiveUser {
    userID: string;
    username: string;
    connectionID: string;
}