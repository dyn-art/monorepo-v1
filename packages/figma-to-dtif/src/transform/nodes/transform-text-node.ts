// TODO:
// 1. Create font bucket
// 2. Search font in google
// 3. If found hash font
// 4. Upload font to font bucket or embed inline
// 5. If not found do not include any font

import { TTransformNodeOptions } from '@/types';

export async function transformTextNode(
  node: TextNode,
  options: TTransformNodeOptions
) {
  // TODO:

  const {
    font: {
      exportOptions: { inline = true, format, uploadStaticData } = {},
    } = {},
  } = options;
  let hash: string;
  let content: Uint8Array | string | undefined;

  // Upload font
  if (uploadStaticData != null && !inline) {
    // TODO:
    content = undefined;
  }

  // Put font inline
  else {
    // TODO:
  }
}
