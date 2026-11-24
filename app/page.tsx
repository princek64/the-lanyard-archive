import { BadgeMetadata } from "../components/badge-metadata";
import { ExhibitionJourney } from "../components/exhibition-journey";
import { archiveTitle, exhibition } from "../lib/badges";

export default function Home() {
  return (
    <main>
      <ExhibitionJourney badges={exhibition}
        intro={<div className="gallery-intro">
          <h1>{archiveTitle}</h1>
          <p>Conference passes collected across London.</p>
        </div>}
        records={exhibition.map(config => <BadgeMetadata key={config.id} config={config} />)} />
    </main>
  );
}
