import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password?: string;
    }): Promise<{
        success: boolean;
        data: {
            user: import("./auth.service.js").UserEntity;
            accessToken: string;
            expiresIn: number;
        };
    }>;
    register(body: {
        email: string;
        role: any;
        firstName: string;
        lastName: string;
    }): Promise<{
        success: boolean;
        data: {
            user: import("./auth.service.js").UserEntity;
            accessToken: string;
            expiresIn: number;
        };
    }>;
    refresh(): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            expiresIn: number;
        };
    }>;
    logout(): Promise<{
        success: boolean;
    }>;
    getProfile(): Promise<{
        success: boolean;
        data: import("./auth.service.js").UserEntity;
    }>;
}
