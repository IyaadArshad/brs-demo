import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("file_name");
  const fileData = url.searchParams.get("data");
  const id = await fetch("/api/data/fetchRecordId?file_name=" + fileName);

  if (!fileName || !fileData) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  if (fileName.length > 500) {
    return Response.json(
      {
        success: false,
        message: "File name too long, pick a shorter name",
      },
      { status: 400 }
    );
  } else if (fileData.length > 100000000) {
    return Response.json(
      {
        success: false,
        message: "File data too large, let the user know the file is too large",
      },
      { status: 400 }
    );
  }

  const data = {
    file_name: fileName,
    data: fileData,
  };

  const record = await pb.collection("files").update(String(id), data);

  return Response.json({ success: "true" });
}