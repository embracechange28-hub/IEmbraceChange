const menotracker = require('../../locales/en/menotracker.json');
const { menotrackerKeys } = require('../../types/i18n/menotracker.keys.cjs');

function flatten(obj, prefix = '') {
  const out = {};
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      Object.assign(out, flatten(v, p));
    }
  } else {
    out[prefix] = true;
  }
  return out;
}

describe('i18n: menotracker', () => {
  test('canonical copy snapshot', () => {
    expect(menotracker).toMatchSnapshot();
  });

  test('contains all defined keys', () => {
    const flat = flatten(menotracker);
    menotrackerKeys.forEach(k => {
      expect(flat).toHaveProperty(k);
    });
  });

  test('no extra unexpected keys (optional)', () => {
    const flat = Object.keys(flatten(menotracker));
    const extras = flat.filter(k => !menotrackerKeys.includes(k));
    expect(extras).toEqual([]);
  });
});
