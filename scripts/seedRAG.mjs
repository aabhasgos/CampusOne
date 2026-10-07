import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const uniqueKnowledge = [
  {
    title: "University Identity & Leadership",
    content: "Bennett University was established in 2016 by The Times Group. It is a private university in TechZone II, Greater Noida, UP. The Chancellor is Mr. Vineet Jain. The Pro-Chancellor is Ms. Revati Jain. The Vice Chancellor is Dr. Raj Singh. The Registrar is Prof. (Dr.) Ajay Kumar Yadav."
  },
  {
    title: "Academic Schools & B.Tech CSE",
    content: "Bennett has 8 main schools, including SCSET (School of Computer Science Engineering and Technology). B.Tech CSE is a 4-year program (160 credits) with 16 specializations like AI, Cloud Computing, Data Science, Cyber Security. Eligibility: Class XII with Physics, Math, and a 3rd subject, minimum 55% overall."
  },
  {
    title: "Fees & Scholarships",
    content: "B.Tech CSE tuition is ₹3,80,000 (Year 1), ₹3,90,000 (Year 2), ₹4,00,000 (Year 3 & 4). Scholarships are awarded on a first-come, first-served basis. Note: AY 2026-27 scholarship allocation is currently fully exhausted."
  },
  {
    title: "Campus Infrastructure & Layout",
    content: "The 68-acre smoke-free campus includes 111 classrooms, 110+ state-of-the-art labs, a moot court, and media labs. Campus blocks include A, B, C2-C11, D1-D6, M, N, and Cafe Block L-1. The Central Library (LRC) operates 24/7."
  },
  {
    title: "Hostel & Dining",
    content: "Separate air-conditioned hostels for boys and girls (capacity 10,000+). Rooms are twin or triple sharing. The multi-cuisine cafeteria (5,775 sq ft) offers both veg and non-veg options. The university mess serves vegetarian food 4 times a day (Eat Right Campus certified by FSSAI)."
  },
  {
    title: "Health, Safety & Transport",
    content: "24/7 Wellness Centre (20-bed) with a day physician and on-call night physician. Over 130 security personnel and 500+ centralized CCTV cameras. Transport services are available for day scholars, faculty, and staff, connecting to metro stations."
  },
  {
    title: "Sports & Student Activities",
    content: "16+ sports facilities including 18 badminton courts and a flood-lit football ground. 40+ student clubs (e.g., Verve for Dance, Advaita for Music, ISAC for Media). Major fests: Uphoria (Cultural), Zenevia (Tech), Sportikon (Sports), Bluemoon (Freshers)."
  },
  {
    title: "Research, Innovation & Placements",
    content: "120+ international collaborations. Features the NVIDIA Bennett Research Centre for AI, and the 'Bennett Hatchery' (up to ₹10 lakh seed funding for startups). Placement highlights: Highest package ₹62 LPA (2025) and ₹1.37 Cr (2023). Over 715 companies visited in 2025."
  },
  {
    title: "Official Communications & Exams",
    content: "General info: info@bennett.edu.in. Admissions: 1800-103-8484 or admissions@bennett.edu.in. Minimum 75% attendance is strictly required per course; falling below this results in a DB grade."
  }
];

async function main() {
  console.log("Starting RAG ingestion process...");
  
  // Clean existing auto-ingested knowledge to prevent duplicates
  await prisma.knowledge.deleteMany();
  console.log("Cleared existing knowledge database.");

  let count = 0;
  for (const doc of uniqueKnowledge) {
    await prisma.knowledge.create({
      data: {
        title: doc.title,
        content: doc.content
      }
    });
    count++;
    console.log(`Ingested: [${doc.title}]`);
  }

  console.log(`RAG Ingestion Complete. Added ${count} distinct knowledge vectors to Tara's memory.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
