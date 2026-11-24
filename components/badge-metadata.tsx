import type { ExhibitionBadge } from "../lib/badges";

export function BadgeMetadata({ config }: { config: ExhibitionBadge }) {
  const { event, dimensions, story } = config;
  return (
    <article className="focus-record">
      <p className="eyebrow">{story.fictional ? "FICTIONAL EVENT RECORD" : "EVENT RECORD"}</p>
      <h2 id="focus-title">{event.name} {event.edition}</h2>
      <dl>
        <div><dt>Date</dt><dd><time dateTime={event.dateTime}>{event.date}</time></dd></div>
        <div><dt>Venue</dt><dd>{story.venue}</dd></div>
        <div><dt>Pass type</dt><dd>{event.pass}</dd></div>
        <div><dt>Dimensions</dt><dd>{dimensions.width} × {dimensions.height} mm</dd></div>
      </dl>
      <h3>Why it mattered</h3>
      <p>{story.note}</p>
    </article>
  );
}
