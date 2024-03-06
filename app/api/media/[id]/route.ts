import { updateMediaWithUrl } from "@/utils/supabase/admin";

export async function POST(request: Request, { params }: { params: { id: string } }) {

    try {
        const body = await request.json();
        console.log(body);
        const {url} = body;
        if (url) {
            await updateMediaWithUrl(url, params.id)
        }
    } catch (err) {
        console.log(err);
    }
    return Response.json({code: 0, message: 'successful'});
}