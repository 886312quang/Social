// @ts-ignore
const aposToLexForm = require("apos-to-lex-form");
const natural = require("natural");
// @ts-ignore
const SpellCorrector = require("spelling-corrector");
const { removeStopwords, eng, fra } = require("stopword");

const tokenizer = new natural.WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new natural.SentimentAnalyzer(
  "English",
  natural.PorterStemmer,
  "afinn"
);

const getSentiment = (str) => {
  if (!str.trim()) {
    return 0;
  }

  const lexed = aposToLexForm(str)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");

  const tokenized = tokenizer.tokenize(lexed);

  const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));

  const stopWordsRemoved = removeStopwords(fixedSpelling);

  const analyzed = analyzer.getSentiment(stopWordsRemoved);

  if (analyzed >= 1) return 1; // positive
  if (analyzed === 0) return 0;
  return -1;
};

module.exports = {
  getSentiment,
};
