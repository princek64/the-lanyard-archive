export interface BadgeConfig {
  id: string;
  dimensions: { width: number; height: number; thickness: number; radius: number };
  artwork: { front: string; back: string; edge: string };
  lanyard: { width: number; length: number; colour: string; texture?: string };
  event: { name: string; edition: string; date: string; dateTime: string; location: string; pass: string };
}

export const archiveTitle = "The Lanyard Archive";

export const badge: BadgeConfig = {
  id: "001",
  dimensions: { width: 90, height: 125, thickness: 2.4, radius: 4 },
  artwork: {
    front: "/badges/assembly-front.svg",
    back: "/badges/assembly-back.svg",
    edge: "#293e80",
  },
  lanyard: {
    width: 15,
    length: 105,
    colour: "#536df0",
    texture: "/badges/assembly-strap.svg",
  },
  event: {
    name: "Assembly",
    edition: "2024",
    date: "18 October 2024",
    dateTime: "2024-10-18",
    location: "London, UK",
    pass: "Attendee",
  },
};

export type ExhibitionBadge = BadgeConfig & {
  story: { venue: string; note: string; fictional?: boolean };
};

export const exhibition: ExhibitionBadge[] = [
  {
    ...badge,
    story: {
      venue: "Southbank, London",
      note: "An afternoon of talks about how things are made, from printed matter to the software we use every day. The cobalt pass is a reminder of the conversation that carried on long after the last talk.",
      fictional: true,
    },
  },
  {
    id: "002",
    dimensions: { width: 85, height: 119, thickness: 2.6, radius: 5 },
    artwork: { front: "/badges/relay-front.svg", back: "/badges/relay-back.svg", edge: "#454c24" },
    lanyard: { width: 13, length: 114, colour: "#a8b84e" },
    event: { name: "Relay", edition: "2025", date: "12 June 2025", dateTime: "2025-06-12", location: "London, UK", pass: "Participant" },
    story: {
      venue: "Clerkenwell, London",
      note: "A small meetup where everyone brought something unfinished. The demos were brief, but the table afterwards was full of sketches and experiments people wanted to try together.",
      fictional: true,
    },
  },
  {
    id: "003",
    dimensions: { width: 92, height: 122, thickness: 2.2, radius: 3 },
    artwork: { front: "/badges/afterhours-front.svg", back: "/badges/afterhours-back.svg", edge: "#5b2a24" },
    lanyard: { width: 16, length: 102, colour: "#b75843" },
    event: { name: "After Hours", edition: "2026", date: "26 March 2026", dateTime: "2026-03-26", location: "London, UK", pass: "Volunteer" },
    story: {
      venue: "Dalston, London",
      note: "The volunteer pass came with a roll of tape and a list of jobs. By the end of the evening the room had become a place to trade ideas about keeping small creative communities going.",
      fictional: true,
    },
  },
];
