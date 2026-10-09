export const hero = {
  kicker: "Coral in augmented reality · Field log № 001",
  line1: "Bring the reef",
  line2: "into your",
  line2Accent2: "world",
  sub: "Coralize brings coral reefs to life through augmented reality. Scan interactive cards to explore corals, reef creatures, and the world beneath the surface.",
  tryCta: "Get it on TestFlight",
  cta: "See how it works",
  specs: [
    { k: "Platform", v: "iOS · ARKit" },
    { k: "Cards", v: "04" },
    { k: "Specimens", v: "03" },
    { k: "Origin", v: "Biorock Indonesia" },
  ],
};

export const ticker = [
  "COR 0001",
  "ACROPORA MURICATA",
  "COR 0002",
  "DRUPELLA CORNUS",
  "MINERAL ACCRETION",
  "CORAL RESTORATION",
  "AUGMENTED REALITY",
];

export const howItWorksSection = {
  label: "How it works",
  index: "№ 02",
  title: "Card in,",
  titleAccent: "coral out.",
  body: "Three simple steps to bring the coral to life.",
};

export const howItWorks = [
  {
    step: "01",
    title: "Take a card",
    body: "Each printed Coralize card carries one specimen or one activity. Flip it over to find the scan code.",
    art: "/step/step-1.webp",
  },
  {
    step: "02",
    title: "Scan it",
    body: "Point your phone's camera at the card. Vision recognises it instantly and anchors the scene in place.",
    art: "/step/step-2.webp",
  },
  {
    step: "03",
    title: "The coral rises",
    body: "A 3D model stands up on the card and tracks it as you move or tilt. On activity cards, pinch to pick creatures off the coral.",
    art: "/step/step-3.webp",
  },
];

export const videoSection = {
  label: "Coralize in action",
  index: "№ 01",
  title: "See coral",
  titleAccent: "come to life.",
  body: "Watch a printed card become a living, tracked 3D scene—held naturally in your hands and explored from every angle.",
};

export const aboutUs = {
  label: "About Us",
  index: "№ 05",
  title: "Meet",
  titleAccent: "Biorookie",
  body: "Five people, different backgrounds, one shared curiosity for the ocean. We're Biorookie, the team behind Coralize, turning what we discovered beneath the surface into something you can explore above it.",
};

export type TeamMember = {
  name: string;
  role: string;
  background: string;
  linkedin: string;
  github: string;
  avatar: string;
};

export const team: TeamMember[] = [
  {
    name: "Pelangi",
    role: "Project Manager / Designer",
    background: "Product Designer",
    linkedin: "https://linkedin.com/in/pelangi-romadoni-a12075254/",
    github: "https://github.com/pelangiromadoni222",
    avatar: "/team/pelangi.webp",
  },
  {
    name: "Kae",
    role: "Developer",
    background: "AI Engineer",
    linkedin: "https://linkedin.com/in/teresakae/",
    github: "https://github.com/teresakae",
    avatar: "/team/kae.webp",
  },
  {
    name: "Fitra",
    role: "Developer",
    background: "Game Developer",
    linkedin: "https://linkedin.com/in/fitraramadhans/",
    github: "https://github.com/fnt4sia",
    avatar: "/team/fitra.webp",
  },
  {
    name: "Frans",
    role: "3D Artist",
    background: "Industrial Engineer",
    linkedin: "https://linkedin.com/in/fransiskus-risky-gawahi-a00202310/",
    github: "https://github.com/gawahirisky24-netizen",
    avatar: "/team/frans.webp",
  },
  {
    name: "Darrel",
    role: "3D Artist",
    background: "Software Engineer",
    linkedin: "https://linkedin.com/in/dapraws",
    github: "https://github.com/dapraws",
    avatar: "/team/darrel.webp",
  },
];

export type CardEntry = {
  id: string;
  title: string;
  code: string;
  category: "EDUCATION" | "ACTIVITY";
  action: string;
  front: string;
  back: string;
};

// Copy transcribed from the printed cards themselves.
export const cards: CardEntry[] = [
  {
    id: "acropora",
    title: "Acropora Muricata",
    code: "COR 0002",
    category: "EDUCATION",
    action: "Scan & view model",
    front: "/cards/acropora-front.webp",
    back: "/cards/acropora-back.webp",
  },
  {
    id: "drupella",
    title: "Drupella Cornus",
    code: "COR 0001",
    category: "EDUCATION",
    action: "Scan & view model",
    front: "/cards/drupella-front.webp",
    back: "/cards/drupella-back.webp",
  },
  {
    id: "thereefarchitect",
    title: "The Reef Architect",
    code: "COR 0001",
    category: "ACTIVITY",
    action: "Scan & play",
    front: "/cards/thereefarchitect-front.webp",
    back: "/cards/thereefarchitect-back.webp",
  },
  {
    id: "thesilentkiller",
    title: "The Silent Killer",
    code: "COR 0001",
    category: "ACTIVITY",
    action: "Scan & play",
    front: "/cards/thesilentkiller-front.webp",
    back: "/cards/thesilentkiller-back.webp",
  },
];

export const cardsSection = {
  label: "The Cards",
  index: "№ 03",
  titleScan: "Scan.",
  titleLearn: "Learn.",
  titleAct: "Act.",
  body: "Education cards let you study a specimen in 3D. Activity cards put it in your hands. Turn one over to find its scan code.",
};

export const testflight = {
  label: "Try it",
  // The real join link. A QR alone is unusable on the device most visitors
  // arrive with — you cannot scan a code with the screen displaying it.
  joinUrl: "https://testflight.apple.com/join/YVCv7bSz",
  linkCta: "Open TestFlight",
  requirement: "Requires an iPhone",
  index: "№ 04",
  title: "Take Coralize",
  titleAccent: "with you.",
  body: "Coralize is on TestFlight. Install the build, then point your camera at a Coralize card to watch the coral rise off it.",
  note: "Point your iPhone camera at the code to open TestFlight.",
  steps: [
    "Install Apple TestFlight",
    "Scan this code to join the build",
    "Point your camera at a Coralize card",
  ],
};

export type SpecimenVariant = {
  id: string;
  label: string;
  model: string;
  note: string;
  /** Slowly cycle the camera closer — for detail only legible up close. */
  pushIn?: boolean;
};

export type SpeciesEntry = {
  id: string;
  name: string;
  scientific: string;
  specimenCode: string;
  cardId?: string;
  description: string;
  facts: string[];
  variants: SpecimenVariant[];
};

export const species: SpeciesEntry[] = [
  {
    id: "acropora",
    name: "Acropora Muricata",
    scientific: "Staghorn Coral",
    specimenCode: "COR 0002",
    cardId: "acropora",
    // Description as printed on the Acropora card.
    description:
      "Also known as Staghorn Coral, it's a branching coral named for its antler-like shape whose complex structure provides shelter for reef creatures. Found on reef slopes and in lagoons, it can grow into large, dense thickets across the reef.",
    facts: [
      "Branching growth form — antler-like, fast-growing.",
      "Shelter architecture for fish and reef invertebrates.",
      "Habitat: reef slopes and lagoons.",
    ],
    variants: [
      {
        id: "bare",
        label: "Colony",
        model: "/models/coral.glb",
        note: "The bare staghorn colony.",
      },
      {
        id: "polyps",
        label: "With polyps",
        model: "/models/coral_with_polyps.glb",
        note: "Polyps extended across the branches — watch as the view moves in.",
        pushIn: true,
      },
      {
        id: "infested",
        label: "Under attack",
        model: "/models/coral_with_drupella.glb",
        note: "Drupella grazing the colony — the scene behind The Silent Killer.",
      },
    ],
  },
  {
    id: "polyp",
    name: "Coral Polyp",
    scientific: "The animal itself",
    specimenCode: "COR 0003",
    description:
      "A coral colony is thousands of these: a single soft-bodied polyp, mouth ringed by tentacles, sitting in a cup of its own limestone. Slice one open and you can see the chambers where it digests, and where its symbiotic algae live.",
    facts: [
      "Tentacles ring a central mouth leading to the gastric cavity.",
      "Septa divide the body into chambers that increase digestive surface.",
      "The gastrodermis houses the algae that feed the coral.",
    ],
    variants: [
      {
        id: "whole",
        label: "Whole",
        model: "/models/polyp_normal.glb",
        note: "A single polyp with tentacles extended.",
      },
      {
        id: "sliced",
        label: "Cross-section",
        model: "/models/polyp_sliced.glb",
        note: "Cut away — epidermis, gastrodermis, pharynx, septa and filaments.",
      },
    ],
  },
  {
    id: "drupella",
    name: "Drupella Cornus",
    scientific: "Coral-eating snail",
    specimenCode: "COR 0001",
    cardId: "drupella",
    // Description as printed on the Drupella card.
    description:
      "Small sea snails with a taste for living coral. Hidden by day, it emerges at night to graze on the reef. Its favorite targets? Corals, including branching Acropora like staghorn. They need to be removed carefully with tweezer due to its size.",
    facts: [
      "Nocturnal grazer — hidden by day, feeding at night.",
      "Preys on branching Acropora, including staghorn.",
      "Removed by hand with tweezers — the basis of the in-app minigame.",
    ],
    variants: [
      {
        id: "single",
        label: "Specimen",
        model: "/models/drupella.glb",
        note: "A single Drupella cornus shell.",
      },
      {
        id: "onCoral",
        label: "On the reef",
        model: "/models/coral_with_drupella.glb",
        note: "In place on a staghorn colony, mid-graze.",
      },
    ],
  },
];

export const biorock = {
  kicker: "With gratitude",
  index: "№ 03",
  headline: "Thank you",
  headlineAccent: "Biorock Indonesia",
  body: "Coralize was inspired by the work of Biorock Indonesia — a community using mineral accretion technology to grow coral structures and rebuild reef habitat by hand. This project exists because of what we learned standing on their reefs.",
  structureLabel: "Biorock structure — mineral accretion frame",
};

// Captions are placeholder — replace with the real moment/date for each photo.
export const photos = [
  { src: "/photos/biorock.webp", caption: "Biorock Info Centre" },
  { src: "/photos/2.webp", caption: "Learning session" },
  { src: "/photos/7.webp", caption: "Specimens up close" },
  { src: "/photos/4.webp", caption: "Into the water" },
  { src: "/photos/6.webp", caption: "After the dive" },
  { src: "/photos/9.webp", caption: "Reef briefing" },
  { src: "/photos/5.webp", caption: "The team" },
  { src: "/photos/3.webp", caption: "Heading out" },
  { src: "/photos/8.webp", caption: "Coral fragments" },
  { src: "/photos/10.webp", caption: "On the beach" },
  { src: "/photos/1.webp", caption: "Arrival" },
];
