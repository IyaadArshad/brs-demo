import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function POST(request: Request) {
  const { file_name } = await request.json();

  try {
    const record = await pb
      .collection("files")
      .getFirstListItem(`file_name='${file_name}'`, { fields: "data" });
    if (String(record.data) === "0") {
      return Response.json({
        success: true,
        initialized: false,
        needsInitialWrite: true,
      });
    } else {
      return Response.json({
        success: true,
        initialized: true,
        needsInitialWrite: false,
      });
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Record not found",
        message:
          "Please double check the file name and try again. Make sure you are using the correct file name",
      },
      { status: 404 }
    );
  }
}