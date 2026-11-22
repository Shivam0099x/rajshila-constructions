/**
 * Centrally organized high-resolution Unsplash architectural demo imagery.
 * 
 * IMPORTANT:
 * These images serve as high-quality architectural placeholders and conceptual references.
 * They are clearly marked as temporary demo visual assets until authentic project photography
 * is uploaded through the Rajshila Construction administration panel.
 */

export const DEMO_NOTICE =
  "Conceptual Architectural Reference — Genuine client project photographs will be updated.";

export const DEMO_IMAGES = {
  hero: [
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
      caption: "Contemporary luxury residence with minimalist structural proportions",
      category: "Architecture",
    },
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
      caption: "Modern villa architecture featuring expansive glazing and natural stone accents",
      category: "Exterior",
    },
  ],
  architecture: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  ],
  interiors: {
    living: [
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
        title: "Sunlit Minimalist Living Pavilion",
        category: "Living Room",
        description: "Open-plan living room with Italian marble flooring, bespoke fluted oak paneling, and warm ambient cove illumination.",
      },
      {
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
        title: "Monochrome Architectural Lounge",
        category: "Living Room",
        description: "Refined neutral palette featuring textured lime-wash walls, bronze detailing, and tailored low-profile modular seating.",
      },
    ],
    bedroom: [
      {
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
        title: "Serene Master Suite",
        category: "Bedroom",
        description: "Acoustic fabric headboard wall with integrated brass reading sconces and warm natural oak wardrobes.",
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80",
        title: "Minimalist Guest Sanctuary",
        category: "Bedroom",
        description: "Earthy linen textures, recessed architectural curtain pelmets, and subtle timber accents.",
      },
    ],
    kitchen: [
      {
        url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
        title: "Statuary Quartz Island Kitchen",
        category: "Kitchen",
        description: "Seamless matte graphite cabinetry, waterfall island with concealed induction prep station, and motorized hardware.",
      },
      {
        url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
        title: "Nordic Warm Wood Kitchen",
        category: "Kitchen",
        description: "Smoked oak veneer finishes, concealed pantry doors, and integrated architectural linear lighting.",
      },
    ],
    bathroom: [
      {
        url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
        title: "Travertine Spa Ensuite",
        category: "Bathroom",
        description: "Floor-to-ceiling honed travertine tiles, floating double vanity, fluted glass shower enclosure, and brushed champagne fixtures.",
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
        title: "Contemporary Slate Powder Room",
        category: "Bathroom",
        description: "Dark stone basin with concealed wall-mount spouts and backlit floating vanity mirror.",
      },
    ],
    commercial: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
        title: "Executive Corporate Suite",
        category: "Commercial Interiors",
        description: "Ergonomic executive boardroom with integrated AV systems, acoustic slatted ceiling, and double-glazed soundproof partitions.",
      },
      {
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
        title: "Boutique Creative Studio",
        category: "Commercial Interiors",
        description: "High-ceiling collaborative open workspace with polished micro-concrete flooring and biophilic planters.",
      },
    ],
    construction: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861563?auto=format&fit=crop&w=1600&q=80",
        title: "Reinforced Concrete Core & Column Pour",
        category: "Civil Construction",
        description: "Rigorous grade-M30 ready-mix concrete pouring with seismic-resistant rebar detailing on residential foundations.",
      },
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
        title: "Architectural Framework & Structural Framing",
        category: "Civil Construction",
        description: "Precision-engineered column shuttering and beam alignments adhering to Indian standard IS 456 codes.",
      },
    ],
  },
};

/**
 * Standard project categories for Rajshila Construction
 */
export const PROJECT_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "residential", label: "Residential Construction" },
  { id: "interior", label: "Bespoke Interiors" },
  { id: "commercial", label: "Commercial & Office" },
  { id: "renovation", label: "Structural Renovation" },
] as const;

/**
 * Standard gallery categories
 */
export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Spaces" },
  { id: "living", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "commercial", label: "Commercial" },
  { id: "construction", label: "Civil & Structural" },
] as const;
