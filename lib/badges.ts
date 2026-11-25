export interface BadgeConfig {
  id: string;
  dimensions: { width: number; height: number; thickness: number; radius: number };
  artwork: { specimen: string; front: string; back: string; edge: string };
  lanyard: { width: number; length: number; colour: string; texture?: string; repeatAspect?: number; clipSpread?: number; sleeveColour?: string };
  body?: "electronic";
  attachment?: "swivel-clip" | "snap-hook";
  event: { name: string; edition?: string; date?: string; dateTime?: string; location?: string; pass?: string };
}

export const archiveTitle = "The Lanyard Archive";

export type ExhibitionBadge = BadgeConfig & {
  label: { inscription: string; materials: string; wall: string; pigment: string };
  story: { venue?: string; note?: string; fictional?: boolean; estimatedDimensions?: boolean };
};

export const exhibition: ExhibitionBadge[] = [
  {
    id: "001",
    label: { inscription: "Prince · Design Engineer", materials: "Printed pass, woven ribbon, two clips", wall: "#b5a8c4", pigment: "#52377b" },
    dimensions: { width: 85, height: 133, thickness: 1.2, radius: 3 },
    artwork: {
      specimen: "/specimens/001.webp", front: "/badges/breakpoint-front.svg", back: "/badges/breakpoint-back.svg", edge: "#28213f",
    },
    lanyard: {
      width: 18, length: 108, colour: "#4c3582", texture: "/badges/breakpoint-strap.svg",
      repeatAspect: 4.7, clipSpread: 45,
    },
    attachment: "snap-hook",
    event: { name: "Breakpoint", edition: "2026", date: "2026", dateTime: "2026", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "002",
    label: { inscription: "@pixelprincedev", materials: "Display, buttons, plastic case", wall: "#b2a5bf", pigment: "#594778" },
    dimensions: { width: 82, height: 114, thickness: 15, radius: 5 },
    artwork: {
      specimen: "/specimens/002.webp", front: "/badges/solana-device-front.svg",
      back: "/badges/solana-device-back.svg",
      edge: "#8059c3",
    },
    lanyard: {
      width: 18, length: 110, colour: "#19191d",
      texture: "/badges/solana-strap.svg", repeatAspect: 5, clipSpread: 53,
    },
    body: "electronic",
    attachment: "swivel-clip",
    event: { name: "Solana electronic badge" },
    story: { estimatedDimensions: true },
  },
  {
    id: "003",
    label: { inscription: "PRINCE KUKREJA", materials: "Printed pass, ribbon, swivel clip", wall: "#c9b0a6", pigment: "#8e3429" },
    dimensions: { width: 85, height: 129, thickness: 0.8, radius: 1 },
    artwork: {
      specimen: "/specimens/003.webp", front: "/badges/houdini-hivealt.svg",
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
  {
    id: "004",
    label: { inscription: "PRINCE · CREW", materials: "Printed pass, ribbon, metal clip", wall: "#cca79e", pigment: "#a42218" },
    dimensions: { width: 83, height: 119, thickness: 0.9, radius: 5 },
    artwork: { specimen: "/specimens/004.webp", front: "/badges/git-nation.svg", back: "/badges/git-nation.svg", edge: "#83100f" },
    lanyard: {
      width: 15, length: 111, colour: "#19191d", texture: "/badges/git-nation-strap.svg", repeatAspect: 4.5,
    },
    attachment: "snap-hook",
    event: { name: "Git Nation", pass: "Crew" },
    story: { estimatedDimensions: true },
  },
  {
    id: "005",
    label: { inscription: "Prince", materials: "Printed card, ink, white ribbon", wall: "#c9a8b1", pigment: "#722c43" },
    dimensions: { width: 92, height: 129, thickness: 0.7, radius: 1 },
    artwork: { specimen: "/specimens/005.webp", front: "/badges/cityjs-front.svg", back: "/badges/cityjs-back.svg", edge: "#d9d4cf" },
    lanyard: {
      width: 18, length: 110, colour: "#eeeef0", texture: "/badges/cityjs-strap.svg", repeatAspect: 8.2,
    },
    attachment: "snap-hook",
    event: { name: "CityJS London", edition: "2026", date: "2026", dateTime: "2026", location: "London, UK" },
    story: { estimatedDimensions: true },
  },
  {
    id: "006",
    label: { inscription: "Prince · Design Engineer", materials: "Printed card, paper label, ink", wall: "#cbafa1", pigment: "#873e2b" },
    dimensions: { width: 77, height: 103, thickness: 0.65, radius: 1 },
    artwork: { specimen: "/specimens/006.webp", front: "/badges/campai-front.svg", back: "/badges/campai-back.svg", edge: "#c4b9c7" },
    lanyard: { width: 10, length: 114, colour: "#222228", texture: "/badges/plain-black-strap.svg" },
    attachment: "swivel-clip",
    event: { name: "CampAI", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "007",
    label: { inscription: "Prince · Design Engineer", materials: "Printed card, ink, woven ribbon", wall: "#473a3e", pigment: "#ad2926" },
    dimensions: { width: 90, height: 125, thickness: 0.75, radius: 1 },
    artwork: { specimen: "/specimens/007.webp", front: "/badges/ddx-front.svg", back: "/badges/ddx-back.svg", edge: "#1d1d20" },
    lanyard: { width: 18, length: 109, colour: "#202126", texture: "/badges/ddx-strap.svg", repeatAspect: 4.375 },
    attachment: "snap-hook",
    event: {
      name: "DDX London", edition: "2026", date: "20 November 2026", dateTime: "2026-11-20",
      location: "London, UK", pass: "Team member",
    },
    story: { estimatedDimensions: true, note: "Wrote my own title. Nobody checked." },
  },
  {
    id: "008",
    label: { inscription: "Prince", materials: "Printed pass, paper label, ink", wall: "#b6b6b3", pigment: "#484951" },
    dimensions: { width: 58, height: 104, thickness: 0.85, radius: 6 },
    artwork: { specimen: "/specimens/008.webp", front: "/badges/brainstation-front.svg", back: "/badges/brainstation-back.svg", edge: "#1c1b20" },
    lanyard: { width: 12, length: 108, colour: "#222228", texture: "/badges/plain-black-strap.svg", sleeveColour: "#bbb9b5" },
    attachment: "snap-hook",
    event: { name: "BrainStation" },
    story: { estimatedDimensions: true },
  },
  {
    id: "009",
    label: { inscription: "Prince · Attendee", materials: "Printed pass, ink, metal clip", wall: "#d0ad80", pigment: "#8b501b" },
    dimensions: { width: 80, height: 116, thickness: 0.8, radius: 7 },
    artwork: { specimen: "/specimens/009.webp", front: "/badges/flower-front.svg", back: "/badges/flower-back.svg", edge: "#ac5b19" },
    lanyard: { width: 12, length: 110, colour: "#222228", texture: "/badges/plain-black-strap.svg", sleeveColour: "#1686a4" },
    attachment: "snap-hook",
    event: { name: "Flower AI Summit", edition: "2026", date: "2026", dateTime: "2026", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "010",
    label: { inscription: "Prince Kukreja · Student", materials: "Printed pass, paper label, ribbon", wall: "#9cb9b0", pigment: "#356758" },
    dimensions: { width: 86, height: 110, thickness: 0.85, radius: 5 },
    artwork: { specimen: "/specimens/010.webp", front: "/badges/droidcon-front.svg", back: "/badges/droidcon-back.svg", edge: "#b7b1bc" },
    lanyard: { width: 18, length: 110, colour: "#191a20", texture: "/badges/droidcon-strap.svg", repeatAspect: 6 },
    attachment: "snap-hook",
    event: {
      name: "droidcon London", edition: "2025", date: "30–31 October 2025", dateTime: "2025-10",
      location: "London, UK", pass: "Team",
    },
    story: { estimatedDimensions: true },
  },
  {
    id: "011",
    label: { inscription: "Prince Attendee · Design Engineer", materials: "Printed pass, woven ribbon, two clips", wall: "#c7a3a0", pigment: "#7c282c" },
    dimensions: { width: 85, height: 127, thickness: 1, radius: 2 },
    artwork: { specimen: "/specimens/011.webp", front: "/badges/sev0.svg", back: "/badges/sev0.svg", edge: "#8f4650" },
    lanyard: {
      width: 18, length: 110, colour: "#f2e6e4", texture: "/badges/sev0-strap.svg", repeatAspect: 3, clipSpread: 53,
    },
    attachment: "snap-hook",
    event: { name: "SEV0", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "012",
    label: { inscription: "Prince Kukreja · Design Engineer", materials: "Printed pass, black ribbon, metal clip", wall: "#a4a6ae", pigment: "#383947" },
    dimensions: { width: 83, height: 133, thickness: 0.85, radius: 3 },
    artwork: { specimen: "/specimens/012.webp", front: "/badges/ship-ldn-front.svg", back: "/badges/ship-ldn-back.svg", edge: "#222229" },
    lanyard: { width: 20, length: 110, colour: "#222228", texture: "/badges/plain-black-strap.svg" },
    attachment: "snap-hook",
    event: { name: "Ship LDN", location: "London, UK" },
    story: { estimatedDimensions: true },
  },
  {
    id: "013",
    label: { inscription: "Prince Kukreja · Design Engineer", materials: "Printed pass, paper label, two clips", wall: "#b1b1bd", pigment: "#565089" },
    dimensions: { width: 92, height: 115, thickness: 0.9, radius: 1 },
    artwork: { specimen: "/specimens/013.webp", front: "/badges/ai-devcon-front.svg", back: "/badges/ai-devcon-back.svg", edge: "#222126" },
    lanyard: {
      width: 17, length: 110, colour: "#1a191e", texture: "/badges/ai-devcon-strap.svg", repeatAspect: 5, clipSpread: 50,
    },
    attachment: "snap-hook",
    event: { name: "AI DevCon", pass: "Crew" },
    story: { estimatedDimensions: true },
  },
  {
    id: "014",
    label: { inscription: "PRINCE", materials: "Printed card, ink, woven ribbon", wall: "#c7aea8", pigment: "#914638" },
    dimensions: { width: 88, height: 124, thickness: 0.65, radius: 1 },
    artwork: { specimen: "/specimens/014.webp", front: "/badges/rnlconf.svg", back: "/badges/rnlconf.svg", edge: "#d3c4c9" },
    lanyard: { width: 18, length: 110, colour: "#1a191e", texture: "/badges/rnlconf-strap.svg", repeatAspect: 5 },
    attachment: "snap-hook",
    event: { name: "RNLConf" },
    story: { estimatedDimensions: true },
  },
  {
    id: "015",
    label: { inscription: "Prince Kukreja · Volunteer", materials: "Printed card, paper label, ribbon", wall: "#c3a2b9", pigment: "#70375d" },
    dimensions: { width: 89, height: 124, thickness: 0.8, radius: 1.5 },
    artwork: { specimen: "/specimens/015.webp", front: "/badges/design-ai-front.svg", back: "/badges/design-ai-back.svg", edge: "#64425f" },
    lanyard: { width: 17, length: 110, colour: "#1a191e", texture: "/badges/design-ai-strap.svg", repeatAspect: 5 },
    attachment: "snap-hook",
    event: { name: "design+AI", pass: "Volunteer" },
    story: { estimatedDimensions: true },
  },
  {
    id: "016",
    label: { inscription: "Prince Kukreja · EXPO", materials: "Printed pass, satin ribbon, two clips", wall: "#a5bcc2", pigment: "#32596c" },
    dimensions: { width: 86, height: 129, thickness: 0.9, radius: 2 },
    artwork: { specimen: "/specimens/016.webp", front: "/badges/london-tech-week-front.svg", back: "/badges/london-tech-week-back.svg", edge: "#404451" },
    lanyard: { width: 19, length: 112, colour: "#669b9e", texture: "/badges/london-tech-week-strap.svg", repeatAspect: 10.5, clipSpread: 57 },
    attachment: "snap-hook",
    event: { name: "London Tech Week", edition: "2026", date: "2026", dateTime: "2026", location: "London, UK", pass: "Expo" },
    story: { estimatedDimensions: true },
  },
  {
    id: "017",
    label: { inscription: "Prince Kukreja · CREW", materials: "Printed card, paper label, satin ribbon", wall: "#a7c8c5", pigment: "#873258" },
    dimensions: { width: 92, height: 115, thickness: 0.8, radius: 1 },
    artwork: { specimen: "/specimens/017.webp", front: "/badges/devoxx-front.svg", back: "/badges/devoxx-back.svg", edge: "#83344e" },
    lanyard: { width: 18, length: 111, colour: "#eec622", texture: "/badges/devoxx-strap.svg", repeatAspect: 6.33 },
    attachment: "snap-hook",
    event: { name: "Devoxx UK", edition: "2026", date: "2026", dateTime: "2026", pass: "Crew" },
    story: { estimatedDimensions: true },
  },
  {
    id: "018",
    label: { inscription: "Prince Kukreja · Design Engineer", materials: "Printed pass, woven ribbon, two clips", wall: "#d5c587", pigment: "#66500f" },
    dimensions: { width: 84, height: 126, thickness: 0.85, radius: 2 },
    artwork: { specimen: "/specimens/018.webp", front: "/badges/open-house-front.svg", back: "/badges/open-house-back.svg", edge: "#bb9c28" },
    lanyard: { width: 18, length: 110, colour: "#151518", texture: "/badges/open-house-strap.svg", repeatAspect: 5.19, clipSpread: 52 },
    attachment: "snap-hook",
    event: { name: "Open House by ClickHouse", edition: "2026", date: "2026", dateTime: "2026", location: "London, UK", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "019",
    label: { inscription: "Prince Kukreja · Attendee", materials: "Printed pass, satin ribbon, metal clip", wall: "#aaa8bd", pigment: "#3d345c" },
    dimensions: { width: 75, height: 120, thickness: 0.9, radius: 4 },
    artwork: { specimen: "/specimens/019.webp", front: "/badges/security-live-front.svg", back: "/badges/security-live-back.svg", edge: "#322f48" },
    lanyard: { width: 20, length: 110, colour: "#18181a", texture: "/badges/security-live-strap.svg", repeatAspect: 5.625 },
    attachment: "snap-hook",
    event: { name: "Security LIVE! Europe", pass: "Attendee" },
    story: { estimatedDimensions: true },
  },
  {
    id: "020",
    label: { inscription: "Prince · Design Engineer", materials: "Printed card, paper label, purple ribbon", wall: "#bcaed1", pigment: "#603d83" },
    dimensions: { width: 85, height: 115, thickness: 0.65, radius: 1 },
    artwork: { specimen: "/specimens/020.webp", front: "/badges/openai-devday-front.svg", back: "/badges/openai-devday-back.svg", edge: "#d4cdd7" },
    lanyard: { width: 11, length: 110, colour: "#54287f", sleeveColour: "#b7afab" },
    attachment: "snap-hook",
    event: { name: "OpenAI DevDay London", location: "London, UK" },
    story: { estimatedDimensions: true },
  },
  {
    id: "021",
    label: { inscription: "PRINCE KUKREJA · DESIGN ENGINEER", materials: "Printed pass, red woven ribbon, metal clip", wall: "#d0b7af", pigment: "#8a2737" },
    dimensions: { width: 100, height: 81, thickness: 0.85, radius: 4 },
    artwork: { specimen: "/specimens/021.webp", front: "/badges/caffe-culture-front.svg", back: "/badges/caffe-culture-front.svg", edge: "#c6c4be" },
    lanyard: { width: 12, length: 110, colour: "#b10c29", sleeveColour: "#aaa4a0" },
    attachment: "snap-hook",
    event: { name: "Caffè Culture Show", edition: "2026", date: "29–30 September 2026", dateTime: "2026-09-29", pass: "Visitor" },
    story: { estimatedDimensions: true },
  },
  {
    id: "022",
    label: { inscription: "Your Birkbeck Journey Starts Here", materials: "Printed campus guide, satin ribbon, metal clip", wall: "#aaa9bd", pigment: "#5c2f69" },
    dimensions: { width: 90, height: 127.5, thickness: 1.3, radius: 1 },
    artwork: { specimen: "/specimens/022.webp", front: "/badges/birkbeck-front.svg", back: "/badges/birkbeck-back.svg", edge: "#7e2954" },
    lanyard: { width: 18, length: 112, colour: "#b41b23", texture: "/badges/birkbeck-strap.svg", repeatAspect: 3.98 },
    attachment: "snap-hook",
    event: { name: "Birkbeck campus guide", location: "Bloomsbury, London" },
    story: { estimatedDimensions: true },
  },
];

/** Horizontal offsets from the badge centre, in millimetres. */
export function ribbonOffsets(lanyard: BadgeConfig["lanyard"]) {
  return lanyard.clipSpread ? [-lanyard.clipSpread / 2, lanyard.clipSpread / 2] : [0];
}
