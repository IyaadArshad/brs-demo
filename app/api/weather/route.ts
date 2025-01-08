// MOCK API ROUTE FOR TEST API FUNCTION CALL
export function GET(request: Request) {
    return Response.json({
        success: true,
        temp: 6900,
        type: "Celsius",
        location: "Paris",
        date: "Tomorrow"
    });
}

export function POST(request: Request) {
    return Response.json({
        success: true,
        temp: 71,
        type: "Celsius",
        location: "Paris",
        date: "Tomorrow"
    });
}

export function OPTIONS(request: Request) {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'GET, POST, OPTIONS'
        }
    });
}