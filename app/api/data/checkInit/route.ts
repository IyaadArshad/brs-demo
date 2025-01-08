import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export function GET(request: Request) {
    return Response.json({
        success: true,
        pb: `${process.env.POCKETBASE_SERVER_URL}`
    })
}