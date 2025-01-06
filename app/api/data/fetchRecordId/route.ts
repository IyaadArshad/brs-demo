import Pocketbase from 'pocketbase';

const pb = new Pocketbase('http://127.0.0.1:8090');

export async function GET(request: Request ) {
    const record = await pb.collection('files').getFirstListItem('file_name="woo.md"', {fields: 'id'});

    return Response.json(record);
}