import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Invalid JWT token:", error);
        return null;
    }
};
