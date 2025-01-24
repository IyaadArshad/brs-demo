import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function POST(request: Request) {
  const { file_name: fileName } = await request.json();

  if (!fileName) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 422 }
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
          message: `A file with the name **${fileName}** already exists, choose another name`,
        }
      );
    }
  } catch (error) {}
  if (fileName.length > 500) {
    return Response.json(
      {
        success: false,
        message: `**'${fileName}'** is too long, pick a shorter name under 500 characters`,
      }
    );
  }
  if (fileName.length < 2) {
    return Response.json(
      {
        success: false,
        message: `**'${fileName}'** is too short, pick a longer name over 2 characters`,
      }
    );
  }

  const initialData = {
    name: `fileName`,
    latestVersion: 0,
    versions: {}
  }

  const data = {
    file_name: fileName,
    data: initialData,
  };

  const record = await pb.collection("files").create(data);

  return Response.json({
    success: "true",
    message: `**${fileName}** has been successfully created`,
    id: record.id,
    file_name: fileName,
  });
}