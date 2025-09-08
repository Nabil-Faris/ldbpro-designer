import { toJson, toXml } from './exports';
import type { PageDataModel } from './types';

const sample: PageDataModel = {
  pageName: 'Page Test',
  components: [
    { id: 'a', type: 'richText', data: { content: 'Hello <world>' } },
    { id: 'b', type: 'button', data: { text: 'Go', url: 'https://x.com?a=1&b=2' } },
  ],
};

describe('exports', () => {
  it('toJson produces valid JSON', () => {
    const json = toJson(sample);
    const parsed = JSON.parse(json);
    expect(parsed.pageName).toBe('Page Test');
    expect(parsed.components).toHaveLength(2);
  });

  it('toXml escapes characters', () => {
    const xml = toXml(sample);
    expect(xml).toContain('&lt;world&gt;');
    expect(xml).toContain('&amp;');
  });
});

