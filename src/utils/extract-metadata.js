import fm from 'front-matter';

function extractMetadata(src) {
  return fm(src); // {attributes, body}
}

export default extractMetadata;
