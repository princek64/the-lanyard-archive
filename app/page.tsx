import Link from "next/link";
import { BadgeMetadata } from "../components/badge-metadata";
import { ExhibitionJourney } from "../components/exhibition-journey";
import { ArchiveMark } from "../components/icons";
import { archiveTitle, exhibition } from "../lib/badges";

export default function Home() {
  const title = archiveTitle.split(" ");
  const lastWord = title.pop();
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label={archiveTitle}><ArchiveMark /><span>Lanyard Archive</span></Link>
        <span className="header-location">London, UK</span>
      </header>
      <main>
        <ExhibitionJourney badges={exhibition}
          intro={<div className="gallery-intro">
            <h1>{title.join(" ")} <em>{lastWord}</em></h1>
            <p>Conference passes collected across London.</p>
          </div>}
          records={exhibition.map(config => <BadgeMetadata key={config.id} config={config} />)} />
      </main>
    </div>
  );
}
