import React, { useMemo } from 'react';
import type { ComponentSchema, PageComponent } from '../types';

type Props = {
  schema: ComponentSchema;
  value: PageComponent;
  onChange: (next: PageComponent) => void;
  onSubmit: () => void;
};

export function ComponentForm({ schema, value, onChange, onSubmit }: Props) {
  const fields = schema.fields;

  const handleChange = (name: string, val: string) => {
    onChange({ ...value, data: { ...value.data, [name]: val } });
  };

  const canSubmit = useMemo(() => {
    return fields.every((f) => !f.required || Boolean(value.data[f.name]));
  }, [fields, value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {fields.map((field) => (
        <label key={field.name} style={{ display: 'block' }}>
          <div style={{ marginBottom: 6, color: '#a7c8ff' }}>
            {field.label}
            {field.required ? ' *' : ''}
          </div>
          {field.type === 'textarea' ? (
            <textarea
              rows={4}
              value={value.data[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="input"
            />
          ) : (
            <input
              type="text"
              value={value.data[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="input"
            />
          )}
        </label>
      ))}
      <button type="submit" disabled={!canSubmit} className="btn btn-primary">
        Enregistrer
      </button>
    </form>
  );
}
export default ComponentForm;

