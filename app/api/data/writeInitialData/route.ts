import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("file_name");
  const fileData = url.searchParams.get("data");
  const id = await fetch(`${process.env.HOSTED}/api/data/fetchRecordId?file_name=` + fileName);
  console.log(id);
  return Response.json({ success: "true", id, file_name: fileName });
}