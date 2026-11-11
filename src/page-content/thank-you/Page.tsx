import CompletionMessage from "./components/CompletionMessage";
import SourceLayout from "@/components/SourceLayout";
import { getPage } from "@/lib/site-model";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 30;
function completionPage() { return getPage("/thank-you")!; }
export async function generateMetadata() {
  return pageMetadata(await completionPage());
}

export default async function ThankYouPage() {
  const page = await completionPage();
  return (
    <SourceLayout
      page={page}
      mainContent={
        <CompletionMessage />
      }
    />
  );
}
