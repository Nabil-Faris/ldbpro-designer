import { createEmptyComponent, COMPONENT_SCHEMAS } from './types';

describe('createEmptyComponent', () => {
  it('creates data keys for all fields', () => {
    const c = createEmptyComponent('genericBanner');
    const fields = COMPONENT_SCHEMAS.genericBanner.fields.map((f) => f.name);
    fields.forEach((name) => {
      expect(Object.prototype.hasOwnProperty.call(c.data, name)).toBe(true);
      expect(c.data[name]).toBe('');
    });
  });

  it('generates a stable id string', () => {
    const c = createEmptyComponent('button');
    expect(typeof c.id).toBe('string');
    expect(c.id.length).toBeGreaterThan(5);
  });
});

