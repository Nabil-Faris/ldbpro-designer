import type { PageDataModel } from './types';

export function toJson(page: PageDataModel): string {
  return JSON.stringify(page, null, 2);
}

export function toXml(page: PageDataModel): string {
  const escapeXml = (value: unknown): string => {
    if (value === undefined || value === null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(`<page name="${escapeXml(page.pageName)}">`);
  lines.push('  <components>');
  page.components.forEach((component) => {
    lines.push(`    <component type="${component.type}">`);
    Object.entries(component.data).forEach(([key, value]) => {
      lines.push(`      <${key}>${escapeXml(value)}</${key}>`);
    });
    lines.push('    </component>');
  });
  lines.push('  </components>');
  lines.push('</page>');
  return lines.join('\n');
}

