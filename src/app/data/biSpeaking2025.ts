/**
 * BAHASA INGGERIS — 1119/3 (Speaking Test)
 * SPM Trial 2025 — Collection of Speaking Questions.
 *
 * 10 set pertama (Kedah 1–6, Terengganu 1–3, Perlis 1) diekstrak daripada
 * dokumen rasmi "Collection of Speaking Questions for 2025 SPM Trial Papers".
 *
 * Struktur setiap set:
 *  - Part 2 (Individual)   : prompt Calon A & Calon B + senarai mata (bullets).
 *  - Part 3 (Discussion)   : soalan tengah (mind map), 6 nod huraian dan
 *                            soalan HOTS (Higher Order Thinking Skills).
 */

export type BiCandidatePrompt = {
  /** Tajuk ringkas calon (cth. "A restaurant experience"). */
  topic: string;
  /** Arahan penuh: "Talk about ...". */
  prompt: string;
  /** Bullet "You should say:". */
  points: string[];
};

export type BiSpeakingSet = {
  /** ID stabil digunakan sebagai `key` React. */
  id: string;
  /** Negeri sumber set (cth. "KEDAH"). */
  state: string;
  /** Nombor set dalam negeri tersebut. */
  setNumber: number;
  /** Part 2 — Calon A. */
  candidateA: BiCandidatePrompt;
  /** Part 2 — Calon B. */
  candidateB: BiCandidatePrompt;
  /** Part 3 — peta minda perbincangan. */
  part3: {
    /** Soalan di tengah peta minda. */
    question: string;
    /** 6 nod/bullet di sekeliling soalan tengah. */
    nodes: string[];
    /** Soalan HOTS di bawah peta minda. */
    hots: string;
  };
};

export const BI_SPEAKING_2025_SETS: BiSpeakingSet[] = [
  {
    id: 'bi-kedah-1',
    state: 'KEDAH',
    setNumber: 1,
    candidateA: {
      topic: 'A restaurant experience',
      prompt: 'Talk about your experience going to a restaurant.',
      points: [
        'the name of the restaurant',
        'type of food that you had',
        'what made the food special',
        'whether eating out with family should be encouraged (why / why not)',
      ],
    },
    candidateB: {
      topic: 'Family routine at home',
      prompt: 'Talk about an activity you always do with your family.',
      points: [
        'what the activity is',
        'when you do it',
        'how you feel about it',
        'if family activities could strengthen the bond between family members (why / why not)',
      ],
    },
    part3: {
      question: 'Ways to protect wildlife',
      nodes: [
        'Spread awareness',
        'Preserve natural habitats',
        'Avoid buying illegal wildlife products',
        'Plant more trees',
        'Be a volunteer',
        'Limit plastic bags usage',
      ],
      hots: 'There is still a lot more to do to protect the environment.',
    },
  },
  {
    id: 'bi-kedah-2',
    state: 'KEDAH',
    setNumber: 2,
    candidateA: {
      topic: 'A smart device',
      prompt: 'Talk about a smart device that you would like to buy.',
      points: [
        'what the device is',
        'where you can buy it',
        'how it might help you',
        'whether it is important to limit the use of technology (why / why not)',
      ],
    },
    candidateB: {
      topic: 'A fashion trend',
      prompt: 'Talk about your favourite fashion trend.',
      points: [
        'what the trend is',
        'where you learned about it',
        'why you like it',
        'if you think following fashion trend is important for teenagers (why / why not)',
      ],
    },
    part3: {
      question: 'Why do people prefer shopping at a mall?',
      nodes: ['Service', 'Brands', 'Facilities', 'Entertainment', 'Safety', 'Outlets'],
      hots: 'Malaysia should build more shopping malls.',
    },
  },
  {
    id: 'bi-kedah-3',
    state: 'KEDAH',
    setNumber: 3,
    candidateA: {
      topic: 'Natural disaster',
      prompt: 'Talk about a natural disaster that you know.',
      points: [
        'what the disaster is',
        'where and when it happened',
        'how it affected you or others',
        'whether it is important to take action to reduce natural disasters (why / why not)',
      ],
    },
    candidateB: {
      topic: 'An unexpected journey',
      prompt: 'Talk about an unexpected journey you experienced.',
      points: [
        'where you had to go',
        'why you had to go there',
        'how you handled the situation',
        'whether you should have backup plans (why / why not)',
      ],
    },
    part3: {
      question: 'Ways to be a smart traveller',
      nodes: [
        'Set daily budget',
        'Take public transportation',
        'Do research',
        'Plan activities',
        'Use student discount',
        'Travel with friends',
      ],
      hots: 'The government should place greater emphasis on local tourism.',
    },
  },
  {
    id: 'bi-kedah-4',
    state: 'KEDAH',
    setNumber: 4,
    candidateA: {
      topic: 'A weekend retreat',
      prompt: 'Talk about a short trip you would like to take.',
      points: [
        'where the place is',
        'what attracts you to the place',
        'activities you can do',
        'whether a short break is important for teenagers (why / why not)',
      ],
    },
    candidateB: {
      topic: 'My favourite social media platforms',
      prompt: 'Talk about your favourite social media platforms.',
      points: [
        'what the social media platforms are',
        'how often you use them',
        'why you like to use them',
        'whether social media affects teenagers\u2019 daily lives (why / why not)',
      ],
    },
    part3: {
      question: 'Ways to reduce stress',
      nodes: [
        'Listen to music',
        'Do exercise',
        'Go for a vacation',
        'Take a break',
        'Seek help',
        'Get enough sleep',
      ],
      hots: 'Schools play an important in promoting mental health awareness.',
    },
  },
  {
    id: 'bi-kedah-5',
    state: 'KEDAH',
    setNumber: 5,
    candidateA: {
      topic: 'An interesting occupation',
      prompt: 'Talk about a job that you think would be interesting.',
      points: [
        'what the job is',
        'why it is interesting',
        'the skills or qualities needed',
        'if you would like to take up this job in the future (why / why not)',
      ],
    },
    candidateB: {
      topic: 'Protecting the environment',
      prompt: 'Talk about something you do to help protect the environment.',
      points: [
        'what you do',
        'when you carry it out',
        'how you feel',
        'if it is more important to prevent global or local environmental problems (why / why not)',
      ],
    },
    part3: {
      question: 'Ways to take good care of your pets',
      nodes: [
        'Show love and attention',
        'Provide safe environment',
        'Prepare nutritional food',
        'Send for grooming',
        'Go for veterinary care',
        'Have regular playtime',
      ],
      hots: 'Children should be taught responsibilities by keeping a pet.',
    },
  },
  {
    id: 'bi-kedah-6',
    state: 'KEDAH',
    setNumber: 6,
    candidateA: {
      topic: 'House appliances',
      prompt: 'Talk about the most important house appliance you need to have in your daily life.',
      points: [
        'what the appliance is',
        'what you use it for',
        'where you can buy the appliance',
        'whether everyone should have the appliance in their house (why / why not)',
      ],
    },
    candidateB: {
      topic: 'My recent online purchase',
      prompt: 'Talk about your recent experience buying something online.',
      points: [
        'what the item was',
        'where you bought it from',
        'how much it cost',
        'whether buying the item online is better than physical store (why / why not)',
      ],
    },
    part3: {
      question: 'Reasons for students to get involved in sports',
      nodes: [
        'Entertainment',
        'Health',
        'Discipline',
        'Self-esteem',
        'Teamwork',
        'Communication',
      ],
      hots: 'The government should provide more sports facilities in schools.',
    },
  },
  {
    id: 'bi-terengganu-1',
    state: 'TERENGGANU',
    setNumber: 1,
    candidateA: {
      topic: 'An enjoyable website',
      prompt: 'Talk about a website you enjoy visiting.',
      points: [
        'what the website is',
        'how often you visit it',
        'why it is entertaining',
        'if students should be careful when browsing the internet (why / why not)',
      ],
    },
    candidateB: {
      topic: 'An ideal job',
      prompt: 'Talk about a job you want to do.',
      points: [
        'what the job is',
        'why you choose it',
        'how you can achieve it',
        'if work life balance is important (why / why not)',
      ],
    },
    part3: {
      question: 'What are the reasons people take art classes?',
      nodes: ['Career', 'Self-expression', 'Relaxation', 'Talent', 'Hobbies', 'Interest'],
      hots: 'How far do you agree that art is just as important as science and math in education?',
    },
  },
  {
    id: 'bi-terengganu-2',
    state: 'TERENGGANU',
    setNumber: 2,
    candidateA: {
      topic: 'Saving money',
      prompt: 'Talk about saving money.',
      points: [
        'how much you save',
        'where you keep the money',
        'how you will spend it',
        'if it is important to have savings (why / why not)',
      ],
    },
    candidateB: {
      topic: 'Healthy eating habit',
      prompt: 'Talk about healthy eating habit.',
      points: [
        'what healthy food you eat',
        'how to prepare it',
        'whether you enjoy it (why / why not)',
        'why it is better to cook at home than to eat out',
      ],
    },
    part3: {
      question: 'How to raise awareness about protecting wildlife?',
      nodes: ['Education', 'Exhibitions', 'Campaigns', 'Donation', 'Posters', 'Join clubs'],
      hots: 'In what ways can sustainable development balance economic growth with environmental protection?',
    },
  },
  {
    id: 'bi-terengganu-3',
    state: 'TERENGGANU',
    setNumber: 3,
    candidateA: {
      topic: 'A place to visit',
      prompt: 'Talk about a place you wish to visit.',
      points: [
        'where it is',
        'what is special about it',
        'how you can go there',
        'if travelling requires a lot of money (why / why not)',
      ],
    },
    candidateB: {
      topic: 'A sport athlete',
      prompt: 'Talk about a sport athlete you would like to meet.',
      points: [
        'who he/she is',
        'how he/she looks like',
        'what you want to do when you meet him/her',
        'how having a role model affects teenagers',
      ],
    },
    part3: {
      question: 'How to be a smart shopper?',
      nodes: ['Budget', 'Price', 'Quality', 'Reviews', 'Be yourself', 'Return policies'],
      hots: 'To what extent are students aware of the growing trend of unnecessary purchases and their impact?',
    },
  },
  {
    id: 'bi-perlis-1',
    state: 'PERLIS',
    setNumber: 1,
    candidateA: {
      topic: 'Part-time job',
      prompt: 'Talk about a part-time job you would like to do after SPM.',
      points: [
        'what it is',
        'why you choose it',
        'where you will work at',
        'why you think part-time job is important to teenagers',
      ],
    },
    candidateB: {
      topic: 'Favourite festive celebration',
      prompt: 'Talk about your favourite festive celebration.',
      points: [
        'what festive celebration you like the most',
        'why you like it',
        'how you celebrate it',
        'why celebrating festive celebration is important in our life',
      ],
    },
    part3: {
      question: 'How to promote tourism in our country?',
      nodes: [
        'Use social media',
        'Give brochures and flyers',
        'Organise campaigns',
        'Introduce cheap travel packages',
        'Advertise local food',
        'Improve tourist facilities',
      ],
      hots: 'In what ways too much tourism can harm a country\u2019s culture and environment?',
    },
  },
];
