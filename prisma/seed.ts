import { PrismaClient, CEFR, QuizMode, QuizType } from '@prisma/client';
const prisma = new PrismaClient();

// Utility to normalize curly/smart quotes to ASCII
const clean = (text: string) =>
  text
    .replace(/[����?]/g, "'")
    .replace(/[����?]/g, '"')
    .replace(/��/g, '...')
    .replace(/[??]/g, '-'); // normalize dashes

async function main() {
  // Clear existing data
  await prisma.quiz.deleteMany();
  await prisma.vocabularyItem.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.section.deleteMany();
  await prisma.story.deleteMany(); // Clear stories too

  const unitNames = [
    'My Favorite Food',
    'At the Zoo',
    'Weekend Plans',
    'My Dream House',
    'Superheroes',
    'At the Park',
    'Birthday Party',
    'Pets and Animals',
    'Magic School',
    'Fun with Friends',
  ];

  const sectionData = [
    { title: 'Section 1', cefr: CEFR.A1, order: 1 },
    { title: 'Section 2', cefr: CEFR.A1, order: 2 },
  ];

  const grammarTopicsSection1 = [
    'Adjectives: common and demonstrative',
    'Adverbs of frequency',
    'Comparatives and superlatives',
    'Going to',
    'How much/how many and very',
    'Common uncountable nouns',
    "I'd like",
    'Imperatives (+/-)',
    'Intensifiers - very basic',
    "Modals: can/can't/could/couldn't",
  ];

  const grammarTopicsSection2 = [
    'Past simple of "to be"',
    'Past Simple',
    'Possessive adjectives',
    "Possessive 's",
    'Prepositions, common',
    'Prepositions of place',
    'Prepositions of time (in/on/at)',
    'Present continuous',
    'Present simple',
    'Pronouns: simple, personal',
    'Questions',
    'There is/are',
    'To be (questions and negatives)',
    'Verb + ing (like/hate/love)',
  ];

  const vocabList =
    `a/an about above across action activity actor actress add address adult advice afraid after afternoon again age ago agree air airport all also always amazing and angry animal another answer any anyone anything apartment apple April area arm around arrive art article artist as ask at August aunt autumn away baby back bad bag ball banana band bank (money) bath bathroom be beach beautiful because become bed bedroom beer before begin beginning behind believe below best better between bicycle big bike bill bird birthday black blog blonde blue boat body book boot bored boring born both bottle box boy boyfriend bread break breakfast bring brother brown build building bus business busy but butter buy by bye cafe cake call camera can cannot capital car card career carrot carry cat CD cent centre century chair change chart cheap check cheese chicken child chocolate choose cinema city class classroom clean climb clock close clothes club coat coffee cold college colour come common company compare complete computer concert conversation cook cooking cool correct cost could country course cousin cow cream create culture cup customer cut dad dance dancer dancing dangerous dark date daughter day dear December decide delicious describe description design desk detail dialogue dictionary die diet difference different difficult dinner dirty discuss dish do doctor dog dollar door down downstairs draw dress drink drive driver during DVD each ear early east easy eat egg eight eighteen eighty elephant eleven else email end enjoy enough euro even evening event ever every everybody everyone everything exam example excited exciting exercise expensive explain extra eye face fact fall false family famous fantastic far farm farmer fast fat father favourite February feel feeling festival few fifteen fifth fifty fill film final find fine finish fire first fish five flat flight floor flower fly follow food foot football for forget form forty four fourteen fourth free Friday friend friendly from front fruit full fun funny future game garden geography get girl girlfriend give glass go good goodbye grandfather grandmother grandparent great green grey group grow guess guitar gym hair half hand happen happy hard hat hate have have to he head health healthy hear hello help her here hey hi high him his history hobby holiday home homework hope horse hospital hot hotel hour house how however hundred hungry husband I ice ice cream idea if imagine important improve in include information interest interested interesting internet interview into introduce island it its jacket January jeans job join journey juice July June just keep key kilometre kind (type) kitchen know land language large last (final) late later laugh learn leave left leg lesson let letter library lie life light (lamp) like (similar) like (enjoy) line lion list listen little live local long look lose lot love lunch machine magazine main make man many map March market married match (contest) May maybe me meal mean meaning meat meet meeting member menu message metre midnight mile milk million minute miss mistake model modern moment Monday money month more morning most mother mountain mouse mouth move movie much mum museum music must my`.split(
      /\s+/,
    );

  const half = Math.ceil(vocabList.length / 2);
  const vocabSection1 = vocabList.slice(0, half);
  const vocabSection2 = vocabList.slice(half);

  const allSections = [
    { ...sectionData[0], grammar: grammarTopicsSection1, vocab: vocabSection1 },
    { ...sectionData[1], grammar: grammarTopicsSection2, vocab: vocabSection2 },
  ];

  for (const section of allSections) {
    const createdSection = await prisma.section.upsert({
      where: { title: section.title },
      update: {},
      create: {
        title: section.title,
        cefr: section.cefr,
        order: section.order,
      },
    });

    for (let i = 0; i < section.grammar.length; i++) {
      const rawGrammar = section.grammar[i];
      const grammarPoint = clean(rawGrammar);
      const name = clean(unitNames[i % unitNames.length]);

      const unit = await prisma.unit.create({
        data: {
          sectionId: createdSection.id,
          name,
          grammarPoint,
          order: i + 1,
        },
      });

      // Vocabulary
      const unitVocab = section.vocab.slice(i * 10, (i + 1) * 10);

      await prisma.vocabularyItem.createMany({
        data: unitVocab.map((word) => ({
          word,
          definition: `Definition of ${word}`,
          imageUrl: `/images/${word}.jpg`,
          unitId: unit.id,
        })),
      });

      // One quiz per unit
      await prisma.quiz.create({
        data: {
          question: `Sample question for ${grammarPoint}`,
          choices: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: 'Option A',
          explanation: 'This is a sample explanation.',
          type: QuizType.MCQ,
          mode: QuizMode.TEXT_TO_TEXT,
          unitId: unit.id,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
