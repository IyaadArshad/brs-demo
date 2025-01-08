import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function POST(request: Request) {
  const { file_name, data } = await request.json();

  interface FetchIdResponse {
    id: string;
  }

  if (!file_name) {
    return Response.json({ code: 400, message: "file_name is required" });
  } else if (!data) {
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

  const fetchIdResponse = await FetchId(file_name);
  const fetchIdData = await fetchIdResponse.json();

  if (fetchIdData.code === 404) {
    return Response.json({
      success: false,
      message: "File not found"
    })
  }

  const id = fetchIdData.id;
  
  var pushData = {
    file_name: file_name,
    data: data
  }
  const updateRecord = await pb.collection('files').update(id, pushData);

  return Response.json({ success: true, file_name: file_name, message: "data overwritten" });
}