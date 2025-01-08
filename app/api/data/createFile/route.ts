import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function POST(request: Request) {
  const { file_name: fileName } = await request.json();

  if (!fileName) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }
  try {
    const existingFile = await pb
      .collection("files")
      .getFirstListItem(`file_name="${fileName}"`);

    if (existingFile) {
      return Response.json(
        {
          success: false,
          message:
            "File with the same name already exists, choose another name",
        },
        { status: 400 }
      );
    }
  } catch (error) {}
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