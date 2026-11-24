import { BadgeMetadata } from "../components/badge-metadata";
import { ExhibitionJourney } from "../components/exhibition-journey";
import { exhibition } from "../lib/badges";

export default function Home() {
  return (
    <main>
      <ExhibitionJourney badges={exhibition}
        records={exhibition.map(config => <BadgeMetadata key={config.id} config={config} />)} />
    </main>
  );
}
