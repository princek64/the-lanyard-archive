import Link from "next/link";
import { BadgeMetadata } from "../components/badge-metadata";
import { ExhibitionJourney } from "../components/exhibition-journey";
import { ArchiveMark, Arrow } from "../components/icons";
import { archiveTitle, exhibition } from "../lib/badges";

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="wordmark"><ArchiveMark /><span>{archiveTitle}</span></Link>
        <span className="header-location"><span /> London, UK</span>
      </header>
      <main>
        <section className="gallery-intro" aria-labelledby="gallery-title">
          <div>
            <p className="eyebrow gallery-kicker">LONDON <span aria-hidden="true">/</span> {exhibition.length} OBJECTS</p>
            <h1 id="gallery-title">{archiveTitle}</h1>
          </div>
          <div className="gallery-intro-copy">
            <p>A digital exhibition of the events, people and places we carry home.</p>
            <a href="#exhibition">Enter exhibition <Arrow /></a>
          </div>
        </section>
        <ExhibitionJourney badges={exhibition}
          records={exhibition.map(config => <BadgeMetadata key={config.id} config={config} />)} />
      </main>
      <footer className="site-footer"><span>{archiveTitle}</span><span>LONDON, UK</span></footer>
    </div>
  );
}
