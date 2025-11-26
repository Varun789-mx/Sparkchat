import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { GetUserCredits } from "@/lib/GetUserCredits";
import { success } from "zod";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return Response.json({
                message: "UNAUTHORIZED",
            }, { status: 401 })
        }
        const credits = await GetUserCredits(session.user.id);
        return Response.json({
            credits,
        }, {
            headers: {
                'Cache-Control': 'no-store,max-age=0',
            }
        })
    } catch (error) {
        return Response.json({ error: "Failed to get credits" }, { status: 500 })
    }
}