import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("file_name");

  if (!fileName) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const existingFile = await pb.collection("files").getFirstListItem(`file_name="${fileName}"`);

  if (existingFile) {
    return Response.json(
      {
        success: false,
        message: "File with the same name already exists, choose another name",
      },
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
  }

  const data = {
    file_name: fileName,
    data: "0",
  };

  const record = await pb.collection("files").create(data);

  return Response.json({
    success: "true",
    message: "File created successfully",
    id: record.id,
    file_name: fileName,
  });
}