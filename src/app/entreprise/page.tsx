import { MassageEntreprisePage } from "@/components/entreprise/MassageEntreprisePage";
import { getPage, getSectionContent } from "@/lib/api";
import { DEFAULT_ENTREPRISE } from "@/lib/defaultContent";
import type { EntrepriseContent } from "@/lib/api";

export default async function EntreprisePage() {
  const page = await getPage("entreprise");
  const content = getSectionContent<EntrepriseContent>(page, "entreprise", DEFAULT_ENTREPRISE.entreprise);
  return <MassageEntreprisePage content={content} />;
}
