import PocketBase from "pocketbase";

const pb = new PocketBase(`${process.env.POCKETBASE_SERVER_URL}`);

export async function POST(request: Request) {
  const params = await request.json();
  const file_name = params.file_name;

  try {
    const record = await pb
      .collection("files")
      .getFirstListItem(`file_name='${file_name}'`, { fields: "id, isLocked" });
    // file found
    if (!record.isLocked) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Document with name ${file_name} is already unlocked`,
        }),
        { status: 400 }
      );
    } else {
      const data = {
        isLocked: false,
      };
      const newRecord = await pb.collection("files").update(record.id, data);
      return new Response(
        JSON.stringify({
          success: true,
          message: `Document with name ${file_name} is now unlocked`,
        })
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Document with name ${file_name} not found`,
      }),
      { status: 404 }
    );
  }
}