import type { ExhibitionBadge } from "../lib/badges";

export function BadgeMetadata({ config }: { config: ExhibitionBadge }) {
  const { event, dimensions, story } = config;
  return (
    <article className="focus-record">
      <p className="eyebrow">Object {config.id}</p>
      <h2 id="focus-title">{event.name} {event.edition}</h2>
      <p className="record-about">{story.about}</p>
      <dl>
        <div><dt>Date</dt><dd>{event.date ? <time dateTime={event.dateTime}>{event.date}</time> : "Undated"}</dd></div>
        {(story.venue || event.location) && <div><dt>{story.venue ? "Venue" : "Location"}</dt><dd>{story.venue ?? event.location}</dd></div>}
        {event.pass && <div><dt>Pass type</dt><dd>{event.pass}</dd></div>}
        <div><dt>Materials</dt><dd>{config.label.materials}</dd></div>
        <div><dt>Dimensions</dt><dd>{dimensions.width} × {dimensions.height} mm{story.estimatedDimensions ? " (estimated)" : ""}</dd></div>
      </dl>
      <a className="record-source" href={story.source}>Source <span aria-hidden="true">↗</span></a>
    </article>
  );
}
