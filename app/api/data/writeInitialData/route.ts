import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("file_name");
  const fileData = url.searchParams.get("data");

  interface FetchIdResponse {
    id: string;
  }

  if (!fileName) {
    return Response.json({ code: 400, message: "file_name is required" });
  } else if (!fileData) {
    return Response.json({ code: 400, message: "data is required" });
  }

  async function FetchId(file_name: string): Promise<Response> {
    try {
      const record: FetchIdResponse = await pb
        .collection("files")
        .getFirstListItem(`file_name='${file_name}'`, { fields: "id" });
      return Response.json({ code: 200, message: "success", id: record.id });
    } catch (error) {
      return Response.json({ code: 404, message: "notfound" });
    }
  }

  const fetchIdResponse = await FetchId(fileName);
  const fetchIdData = await fetchIdResponse.json();

  if (fetchIdData.code === 404) {
    return Response.json({
      success: false,
      message: "File not found"
    })
  }

  const id = fetchIdData.id;
  
  console.log(id);
  return Response.json({ success: "true", id, file_name: fileName });
}