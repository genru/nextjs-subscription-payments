export async function GET(request: Request,{ params }: { params: { id: string } }) {

  const { searchParams } = new URL(request.url)
  console.log(params.id);
  console.log(searchParams);
  return Response.json({ ok: true, status: 200, params, searchParams})
}