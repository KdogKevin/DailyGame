export type Category =
  | "Geography"
  | "Nature"
  | "Science"
  | "Animals"
  | "History"
  | "Business"
  | "Space";

export type Question = {
  id: string;
  category: Category;
  prompt: string;
  unit: string;
  answer: number;
  source: string;
  /**
   * Optional override for the input scale (see `resolveScale` in
   * lib/game.ts, which auto-derives this from `answer` for
   * million/billion-sized numbers). Only set this to force a scale
   * `resolveScale` wouldn't pick on its own.
   */
  scale?: { value: number; label: string };
};

export type QuestionDay = {
  day: number;
  questions: [Question, Question, Question, Question, Question];
};

// Each entry is one day's set of 5 estimation questions.
// Answers are sourced facts (see `source`); a few are commonly-cited
// approximations where exact figures are debated or constantly changing —
// those are noted as "approx." in the source.
export const QUESTION_DAYS: QuestionDay[] = [
  {
    day: 1,
    questions: [
      {
        id: "d1q1",
        category: "Geography",
        prompt: "What is the population of Iceland?",
        unit: "people",
        answer: 394530,
        source: "Statistics Iceland, end of Q4 2025",
      },
      {
        id: "d1q2",
        category: "Nature",
        prompt: "How tall is Mount Everest?",
        unit: "meters",
        answer: 8849,
        source: "Official China/Nepal joint survey, 2020",
      },
      {
        id: "d1q3",
        category: "Science",
        prompt: "How many neurons are in the average human brain?",
        unit: "neurons",
        answer: 86000000000,
        source: "Azevedo et al. 2009, isotropic fractionator study",
      },
      {
        id: "d1q4",
        category: "Animals",
        prompt: "What is a cheetah's top running speed?",
        unit: "km/h",
        answer: 110,
        source: "Commonly-cited field measurement, approx.",
      },
      {
        id: "d1q5",
        category: "Business",
        prompt: "How many McDonald's restaurants are there worldwide?",
        unit: "restaurants",
        answer: 45356,
        source: "McDonald's FY2025 year-end report",
      },
    ],
  },
  {
    day: 2,
    questions: [
      {
        id: "d2q1",
        category: "Space",
        prompt: "What is the average distance from Earth to the Moon?",
        unit: "km",
        answer: 384400,
        source: "NASA, mean Earth-Moon distance",
      },
      {
        id: "d2q2",
        category: "Nature",
        prompt: "How much does an adult blue whale typically weigh?",
        unit: "kg",
        answer: 125000,
        source: "NOAA Fisheries, typical adult range 100,000-150,000 kg",
      },
      {
        id: "d2q3",
        category: "Science",
        prompt: "How many bones does the adult human body have?",
        unit: "bones",
        answer: 206,
        source: "Standard human anatomy reference",
      },
      {
        id: "d2q4",
        category: "Geography",
        prompt: "How long is the Nile River?",
        unit: "km",
        answer: 6650,
        source: "Commonly-cited geographic survey, approx.",
      },
      {
        id: "d2q5",
        category: "Business",
        prompt: "How many Starbucks stores are there worldwide?",
        unit: "stores",
        answer: 40990,
        source: "Starbucks FY2025 annual report",
      },
    ],
  },
  {
    day: 3,
    questions: [
      {
        id: "d3q1",
        category: "Science",
        prompt: "How fast does light travel in a vacuum?",
        unit: "km/s",
        answer: 299792,
        source: "Physical constant (exact)",
      },
      {
        id: "d3q2",
        category: "Nature",
        prompt: "How many ant species have scientists formally described?",
        unit: "species",
        answer: 14260,
        source: "Senckenberg Society, 2025 taxonomic review",
      },
      {
        id: "d3q3",
        category: "History",
        prompt: "How many people have walked on the Moon?",
        unit: "people",
        answer: 12,
        source: "NASA Apollo program records",
      },
      {
        id: "d3q4",
        category: "Geography",
        prompt: "How many countries are there in Africa?",
        unit: "countries",
        answer: 54,
        source: "United Nations member states in Africa",
      },
      {
        id: "d3q5",
        category: "Geography",
        prompt: "How many time zones does Russia span?",
        unit: "time zones",
        answer: 11,
        source: "Official Russian time zone law",
      },
    ],
  },
  {
    day: 4,
    questions: [
      {
        id: "d4q1",
        category: "Geography",
        prompt: "How deep is the Mariana Trench at its deepest point?",
        unit: "meters",
        answer: 10935,
        source: "Five Deeps Expedition sonar survey, 2019",
      },
      {
        id: "d4q2",
        category: "Animals",
        prompt: "How long is an African elephant's pregnancy?",
        unit: "days",
        answer: 660,
        source: "Standard wildlife biology reference, approx. 22 months",
      },
      {
        id: "d4q3",
        category: "Science",
        prompt: "How many times does the average human heart beat per day?",
        unit: "beats",
        answer: 100000,
        source: "Standard cardiology reference, approx.",
      },
      {
        id: "d4q4",
        category: "Science",
        prompt: "How many taste buds does the average human tongue have?",
        unit: "taste buds",
        answer: 10000,
        source: "Standard physiology reference, approx.",
      },
      {
        id: "d4q5",
        category: "Science",
        prompt: "How many muscles are in the human body?",
        unit: "muscles",
        answer: 600,
        source: "Standard human anatomy reference, approx.",
      },
    ],
  },
  {
    day: 5,
    questions: [
      {
        id: "d5q1",
        category: "Geography",
        prompt: "How large is the Sahara Desert?",
        unit: "sq km",
        answer: 9200000,
        source: "Commonly-cited geographic survey, approx.",
      },
      {
        id: "d5q2",
        category: "Animals",
        prompt: "How much does an adult male African elephant typically weigh?",
        unit: "kg",
        answer: 6000,
        source: "African Wildlife Foundation, approx.",
      },
      {
        id: "d5q3",
        category: "Space",
        prompt: "How many Earths could fit inside the Sun by volume?",
        unit: "Earths",
        answer: 1300000,
        source: "NASA volume comparison",
      },
      {
        id: "d5q4",
        category: "History",
        prompt: "How many steps are there to the top of the Eiffel Tower?",
        unit: "steps",
        answer: 1665,
        source: "Official Eiffel Tower visitor information",
      },
      {
        id: "d5q5",
        category: "Animals",
        prompt: "What is the average lifespan of a housefly?",
        unit: "days",
        answer: 28,
        source: "Entomological reference, typical range 15-30 days",
      },
    ],
  },
  {
    day: 6,
    questions: [
      {
        id: "d6q1",
        category: "Geography",
        prompt: "How long is the Great Wall of China, including all its branches?",
        unit: "km",
        answer: 21196,
        source: "Chinese State Administration of Cultural Heritage, 2012 survey",
      },
      {
        id: "d6q2",
        category: "Science",
        prompt: "How many hairs does the average human head have?",
        unit: "hairs",
        answer: 100000,
        source: "Standard dermatology reference, approx.",
      },
      {
        id: "d6q3",
        category: "Space",
        prompt: "What is the diameter of the Moon?",
        unit: "km",
        answer: 3474,
        source: "NASA lunar fact sheet",
      },
      {
        id: "d6q4",
        category: "Animals",
        prompt: "How many hearts does an octopus have?",
        unit: "hearts",
        answer: 3,
        source: "Standard marine biology reference",
      },
      {
        id: "d6q5",
        category: "Geography",
        prompt: "How many living languages are spoken in the world today?",
        unit: "languages",
        answer: 7164,
        source: "Ethnologue, approx.",
      },
    ],
  },
  {
    day: 7,
    questions: [
      {
        id: "d7q1",
        category: "Geography",
        prompt: "How deep is Lake Baikal, the deepest lake in the world?",
        unit: "meters",
        answer: 1642,
        source: "Russian Academy of Sciences survey",
      },
      {
        id: "d7q2",
        category: "Animals",
        prompt: "How many species of shark have scientists described?",
        unit: "species",
        answer: 536,
        source: "Standard marine biology reference, approx.",
      },
      {
        id: "d7q3",
        category: "Science",
        prompt: "How many bones is a human baby born with?",
        unit: "bones",
        answer: 300,
        source: "Standard pediatric anatomy reference",
      },
      {
        id: "d7q4",
        category: "History",
        prompt: "How many Egyptian pyramids have archaeologists discovered so far?",
        unit: "pyramids",
        answer: 118,
        source: "Egyptian Ministry of Antiquities, approx.",
      },
      {
        id: "d7q5",
        category: "Animals",
        prompt: "What is a peregrine falcon's top diving speed?",
        unit: "km/h",
        answer: 390,
        source: "Commonly-cited field measurement, approx.",
      },
    ],
  },
];
