import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string,
        email: string,
        username: string,
        ispremium: boolean
        image?: string,
    }
    interface Session {
        user: {
            id: string,
            email: string,
            username: string,
            ispremium: boolean
            image?: string,
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string,
        email: string,
        username: string,
        image?: string,
        ispremium: boolean
    }
    interface profile {
        id: string,
        email: string,
        name: string,
        image?: string,
        ispremium?: boolean
    }
}