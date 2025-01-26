export async function GET(request: Request) {
    // file_name from query parameters
    const url = new URL(request.url);
    const file_name = url.searchParams.get("file_name");
    const user_inputs = url.searchParams.get("user_inputs");

    if (!file_name) {
        return Response.json({ success: false, message: "file_name is required" });
    } else if (!user_inputs) {
        return Response.json({ success: false, message: "user_inputs is required" });
    }

    console.log()
    console.log()
    console.log("SUBFUNCTION HAS BEEN CALLED -> IMPLEMENT EDITS")
    console.log()

    let overview;

    // get an overview
    try {
        overview = await fetch('http://localhost:3000/api/generative/get_overview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: user_inputs,
                file_name: file_name
            })
        }).then(res => res.json());
    } catch (error) {
        // Return an error response
        return Response.json({ success: false, message: "Failed to generate an implementation plan, let alone implemenent it"})
    }

    console.log("GENERATED OVERVIEW / IMPLEMENTATION PLAN")
    console.log("Overview: ", overview)

    // implement that overview

    try {
        const implemented_overview = await fetch ('http://localhost:3000/api/generative/implement_overview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                overview: overview,
                file_name: file_name
            })
        })
        const implemenent_overview_json = await implemented_overview.json()
        const latestVersion = implemenent_overview_json.latestVersion

        console.log("IMPLEMENTED OVERVIEW")
        console.log("Implementation: ", implemented_overview)
        return Response.json({
            success: true,
            overview: overview,
            message: "Display the overview of what was implemented to the user in a message, without changing it at all. The edits have successfully been made to the file",
            file_name: file_name,
            latestVersion: latestVersion
        })
    } catch (error) {
        return Response.json({ success: false, message: "Successfully generated an implementation plan, but was unable to implemenent it"})
    }
}