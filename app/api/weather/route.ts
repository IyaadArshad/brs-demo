// MOCK API ROUTE FOR TEST API FUNCTION CALL
export function POST (request : Request) {
    return Response.json({
        success: true,
        temp: 29.293,
        type: "Celcius",
        location: "Paris",
        date: "Tommorow"
    })
}