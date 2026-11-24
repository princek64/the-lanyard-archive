export interface BadgeConfig {
  id: string;
  dimensions: { width: number; height: number; thickness: number; radius: number };
  artwork: { front: string; back: string; edge: string };
  lanyard: { width: number; length: number; colour: string; texture?: string; repeatAspect?: number };
  attachment?: "swivel-clip";
  event: { name: string; edition: string; date: string; dateTime: string; location: string; pass?: string };
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
  story: { venue?: string; note?: string; fictional?: boolean; estimatedDimensions?: boolean };
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
    dimensions: { width: 85, height: 129, thickness: 0.8, radius: 1 },
    artwork: {
      front: "/badges/houdini-hivealt.svg",
      back: "/badges/houdini-hivealt.svg",
      edge: "#262326",
    },
    lanyard: {
      width: 20, length: 109, colour: "#18181c",
      texture: "/badges/houdini-strap.svg", repeatAspect: 5,
    },
    attachment: "swivel-clip",
    event: { name: "Houdini HIVEalt", edition: "2026", date: "2026", dateTime: "2026", location: "London, UK" },
    story: { estimatedDimensions: true },
  },
];
