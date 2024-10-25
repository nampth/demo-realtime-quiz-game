import * as jwt from 'jsonwebtoken';

export function getTokenFromCookie(cookie_str: string, token_name: string): string {
    if (cookie_str) {
        const cookies = cookie_str.split('; ');
        let token = null;
        cookies.forEach((cookie) => {
            if (cookie.includes(token_name)) {
                token = cookie
            }
        })
        if (token) {
            token = token.replace(`${token_name}=`, '');
            return token;
        }
    }
    return null;
}

// check token expiration
export function isTokenAboutToExpire(token: string): boolean {
    try {
        const decodedToken = jwt.decode(token, { complete: true }) as { [key: string]: any };
        if (!decodedToken || typeof decodedToken.payload.exp !== 'number') {
            return false; // Token is invalid or doesn't have an expiration time
        }

        // Calculate the current time in seconds
        const currentTime = Math.floor(Date.now() / 1000);

        // Calculate the expiration time of the token
        const expirationTime = decodedToken.payload.exp;

        // Check if the token is about to expire within the next 30 seconds
        const isAboutToExpire = expirationTime - currentTime < 30;

        return isAboutToExpire;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
}