export interface UserEntity {
    id: string;
    email: string;
    role: 'BORROWER' | 'LENDER' | 'ADMIN' | 'MERCHANT';
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    firstName?: string;
    lastName?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class AuthService {
    private users;
    login(credentials: {
        email: string;
        password?: string;
    }): Promise<{
        success: boolean;
        data: {
            user: UserEntity;
            accessToken: string;
            expiresIn: number;
        };
    }>;
    register(payload: {
        email: string;
        role: any;
        firstName: string;
        lastName: string;
    }): Promise<{
        success: boolean;
        data: {
            user: UserEntity;
            accessToken: string;
            expiresIn: number;
        };
    }>;
    getProfile(userId?: string): Promise<{
        success: boolean;
        data: UserEntity;
    }>;
}
