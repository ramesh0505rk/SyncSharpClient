export interface Work {
    workID: string;
    title: string;
    description: string
    code: string;
    language: string;
    createdBy: string;
    createdAt: Date;
    lastModified: Date;
    activeUsersCount: number;
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

export interface GeneralResponse<T> {
    data: T;
    success: boolean;
    requestId: string;
    responseMessage: string;
}