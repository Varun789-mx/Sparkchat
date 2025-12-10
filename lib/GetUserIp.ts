import { headers } from "next/headers";

export async function GetUserIp() {
  const headersList = await headers();
  const UserIp =
    headersList.get(`x-forwarded-for`)?.split(".")[0] ||
    headersList.get(`x-real-ip`) ||
    "127.0.0.1";
  return UserIp;
}
