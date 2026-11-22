import { IProject } from "@/types";

export const DEMO_PROJECTS: IProject[] = [
  {
    title: "The Stone & Glass Residence",
    slug: "stone-glass-residence",
    description:
      "A 4,200 sq.ft. luxury residential villa in Arera Colony, Bhopal. Built with RCC shear walls, Italian marble cladding, double-glazed acoustic curtain walls, and cantilevered balconies.",
    category: "residential",
    location: "Arera Colony, Bhopal, MP",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    ],
    startDate: "2023-04-10T00:00:00.000Z",
    expectedCompletionDate: "2024-03-31T00:00:00.000Z",
    actualCompletionDate: "2024-03-20T00:00:00.000Z", // Finished early!
    status: "completed",
    progressPercentage: 100,
    featured: true,
    published: true,
    milestones: [
      {
        title: "Excavation & Raft Foundation",
        description: "Completed foundation with waterproofing and termite barrier",
        targetDate: "2023-06-15T00:00:00.000Z",
        completedDate: "2023-06-10T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "RCC Frame & Slab Casting",
        description: "Two-floor structural concrete frame with post-tensioned beams",
        targetDate: "2023-09-30T00:00:00.000Z",
        completedDate: "2023-09-25T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Masonry, MEP & Plastering",
        description: "Autoclaved aerated concrete (AAC) blocks and concealed piping",
        targetDate: "2023-12-15T00:00:00.000Z",
        completedDate: "2023-12-12T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Flooring, Glazing & Handover",
        description: "Italian marble polishing, Schuco profile fenestration, final testing",
        targetDate: "2024-03-31T00:00:00.000Z",
        completedDate: "2024-03-20T00:00:00.000Z",
        isCompleted: true,
      },
    ],
  },
  {
    title: "Minimalist Penthouse Renovation",
    slug: "minimalist-penthouse-renovation",
    description:
      "Complete interior architecture and turnkey fit-out for a 2,800 sq.ft. penthouse overlooking the Upper Lake, Bhopal. Custom veneer millwork, shadow-line false ceilings, and smart lighting automation.",
    category: "interior",
    location: "VIP Road, Bhopal, MP",
    coverImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
    ],
    startDate: "2023-08-01T00:00:00.000Z",
    expectedCompletionDate: "2023-12-15T00:00:00.000Z",
    actualCompletionDate: "2023-12-15T00:00:00.000Z", // On time!
    status: "completed",
    progressPercentage: 100,
    featured: true,
    published: true,
    milestones: [
      {
        title: "Demolition & Civil Alterations",
        description: "Removal of non-load bearing partitions and conduit routing",
        targetDate: "2023-08-25T00:00:00.000Z",
        completedDate: "2023-08-24T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Bespoke Carpentry & Framing",
        description: "Marine-ply core joinery with natural smoked oak veneer",
        targetDate: "2023-10-30T00:00:00.000Z",
        completedDate: "2023-10-28T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Surfacing, Fixtures & Client Handover",
        description: "Polyurethane finishes, Grohe bath fittings, and deep clean",
        targetDate: "2023-12-15T00:00:00.000Z",
        completedDate: "2023-12-15T00:00:00.000Z",
        isCompleted: true,
      },
    ],
  },
  {
    title: "Corporate Law Chambers Fit-out",
    slug: "corporate-law-chambers",
    description:
      "A 3,500 sq.ft. commercial workspace featuring sound-attenuated acoustic conference chambers, bespoke reception desk with fluted timber, and ergonomic partner cabins.",
    category: "commercial",
    location: "MP Nagar Zone II, Bhopal, MP",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    ],
    startDate: "2023-02-01T00:00:00.000Z",
    expectedCompletionDate: "2023-05-15T00:00:00.000Z",
    actualCompletionDate: "2023-05-25T00:00:00.000Z", // Completed with minor delay
    status: "completed",
    progressPercentage: 100,
    featured: false,
    published: true,
    milestones: [
      {
        title: "HVAC & Electrical Rough-in",
        description: "Ducting layout, server room wiring, fire suppression lines",
        isCompleted: true,
      },
      {
        title: "Acoustic Glazing & Partitions",
        description: "Double glazed demountable partitions with acoustic drop seals",
        isCompleted: true,
      },
      {
        title: "Millwork & Handover",
        description: "Conference table assembly, carpet tile installation",
        isCompleted: true,
      },
    ],
  },
  {
    title: "Ayodhya Heights Duplex Interior",
    slug: "ayodhya-heights-duplex",
    description:
      "Turnkey interior design and execution of a 3,600 sq.ft. duplex home near Ayodhya Bypass. Features open kitchen concept, custom floating stair treads, and smart home lighting.",
    category: "interior",
    location: "Ayodhya Bypass, Bhopal, MP",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
    ],
    startDate: "2024-08-01T00:00:00.000Z",
    expectedCompletionDate: "2025-01-31T00:00:00.000Z",
    status: "ongoing",
    progressPercentage: 75,
    latestUpdate: "Modular woodwork in progress. False ceiling framework completed; electrical wiring passed inspection.",
    featured: true,
    published: true,
    milestones: [
      {
        title: "Civil Alterations & Demolition",
        description: "Kitchen wall opening and bathroom plumbing revisions",
        targetDate: "2024-08-20T00:00:00.000Z",
        completedDate: "2024-08-18T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Electrical & False Ceiling",
        description: "POP cove ceilings with dimmable architectural profiles",
        targetDate: "2024-10-15T00:00:00.000Z",
        completedDate: "2024-10-14T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Bespoke Wardrobes & Modular Kitchen",
        description: "Carcass installation and quartz countertop template",
        targetDate: "2024-12-15T00:00:00.000Z",
        isCompleted: false,
      },
      {
        title: "PU Painting, Polishing & Handover",
        description: "Wall painting, wallpaper accents, fixture fitting",
        targetDate: "2025-01-31T00:00:00.000Z",
        isCompleted: false,
      },
    ],
  },
  {
    title: "Kolar Villa Modern Interior",
    slug: "kolar-villa-modern-interior",
    description:
      "Ongoing bespoke interior execution for a 4-bedroom villa in Kolar Road, Bhopal. Scope includes living pavilion, four ensuite bedrooms, and an outdoor courtyard deck.",
    category: "interior",
    location: "Kolar Road, Bhopal, MP",
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    ],
    startDate: "2024-09-15T00:00:00.000Z",
    expectedCompletionDate: "2025-03-15T00:00:00.000Z",
    status: "ongoing",
    progressPercentage: 45,
    latestUpdate: "Plastering completed; bathroom waterproofing cured and flood tested successfully.",
    featured: false,
    published: true,
    milestones: [
      {
        title: "Structural Modifications",
        description: "Doorway relocation and steel lintel placement",
        targetDate: "2024-10-10T00:00:00.000Z",
        completedDate: "2024-10-08T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Waterproofing & Plumbing",
        description: "Dual-coat polymer modified waterproofing in all wet areas",
        targetDate: "2024-11-20T00:00:00.000Z",
        completedDate: "2024-11-18T00:00:00.000Z",
        isCompleted: true,
      },
      {
        title: "Tiling & False Ceiling",
        description: "1200x1800mm vitrified slabs and gypsum framing",
        targetDate: "2025-01-10T00:00:00.000Z",
        isCompleted: false,
      },
      {
        title: "Carpentry & Final Finishes",
        description: "Wardrobes, wall paneling, sanitary fittings",
        targetDate: "2025-03-15T00:00:00.000Z",
        isCompleted: false,
      },
    ],
  },
];
