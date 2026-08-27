import { TodoDashboard } from "@/components/todo/TodoDashboard";

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  if (searchParams.crashServer === 'true') {
    // Simulate a realistic Server Component error (e.g. malformed data from a database or API)
    const apiResponseData: any = undefined;
    const items = apiResponseData.items.map((i: any) => i.id); // Throws TypeError: Cannot read properties of undefined (reading 'items')
  }

  return (
    <main className="min-h-screen">
      <TodoDashboard />
    </main>
  );
}
