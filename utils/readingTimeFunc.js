function readingTime(body) {
  const wordsPerMinute = 200;
  const noOfWords = body.split(" ").length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
}

module.exports = { readingTime };
