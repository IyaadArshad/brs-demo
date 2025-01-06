import Pocketbase from 'pocketbase';

const pb = new Pocketbase('http://127.0.0.1:8090');

export async function GET(request: Request ) {
    const url = new URL(request.url);
    const file_name = url.searchParams.get('file_name');

    const record = await pb.collection('files').getFirstListItem(`file_name='${file_name}'`, {fields: 'id'});

    return Response.json(record);
}