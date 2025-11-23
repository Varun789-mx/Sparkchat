import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id?: string,
        email?: string,
        username?: string,
        credits?: number,
        ispremium?: boolean
    }
    interface Session {
        user: {
            id?: string,
            email?: string,
            username?: string,
            credits?: number,
            ispremium?: boolean
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string,
        email?: string,
        username?: string,
        credits?: number,
        ispremium?: boolean
    }
}