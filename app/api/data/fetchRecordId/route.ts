import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const file_name = url.searchParams.get("file_name");

  try {
    const record = await pb
      .collection("files")
      .getFirstListItem(`file_name='${file_name}'`, { fields: "id" });
    return Response.json(record);
  } catch (error) {
    return Response.json({ error: "Record not found" }, { status: 404 });
  }
}