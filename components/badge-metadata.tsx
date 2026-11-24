import type { ExhibitionBadge } from "../lib/badges";

export function BadgeMetadata({ config }: { config: ExhibitionBadge }) {
  const { event, dimensions, story } = config;
  return (
    <article className="focus-record">
      <p className="eyebrow">{story.fictional ? "FICTIONAL EVENT RECORD" : "EVENT RECORD"}</p>
      <h2 id="focus-title">{event.name} {event.edition}</h2>
      <dl>
        {event.date && <div><dt>Date</dt><dd><time dateTime={event.dateTime}>{event.date}</time></dd></div>}
        {(story.venue || event.location) && <div><dt>{story.venue ? "Venue" : "Location"}</dt><dd>{story.venue ?? event.location}</dd></div>}
        {event.pass && <div><dt>Pass type</dt><dd>{event.pass}</dd></div>}
        <div><dt>Dimensions</dt><dd>{dimensions.width} × {dimensions.height} mm{story.estimatedDimensions ? " (estimated)" : ""}</dd></div>
      </dl>
      {story.note && <>
        <h3>Collector’s note</h3>
        <p>{story.note}</p>
      </>}
    </article>
  );
}
