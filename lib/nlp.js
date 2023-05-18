import Natural from 'natural';

const tokenizer = new Natural.WordTokenizer();
const stemmer = Natural.PorterStemmer;

export function nlp(keyword, flow) {
  const tokens = tokenizer.tokenize(keyword.toLowerCase());
  const stems = tokens.map((token) => stemmer.stem(token));

  return flow.filter((value) => {
    const keywords = value.keyword.split(',');
    const itemKeywords = keywords.map((key) => stemmer.stem(key.trim()));

    return itemKeywords.some((keyword) => stems.includes(keyword));
  });
}
