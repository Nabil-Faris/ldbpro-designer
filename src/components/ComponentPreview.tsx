import React from 'react';
import type { PageComponent } from '../types';

type Props = { component: PageComponent };

export function ComponentPreview({ component }: Props) {
  const { type, data } = component;
  switch (type) {
    case 'richText':
      return <p style={{ color: '#d1d5e1', lineHeight: 1.65 }}>{data.content || 'Contenu texte riche...'}</p>;
    case 'imageBanner':
      return (
        <div>
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 10 }} />
          ) : (
            <div style={placeholder}>Image</div>
          )}
          <h4 className="card-title" style={{ marginBottom: 8 }}>{data.title || 'Titre de la bannière'}</h4>
        </div>
      );
    case 'genericBanner':
      return (
        <div>
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 10 }} />
          ) : (
            <div style={placeholder}>Image</div>
          )}
          <h4 className="card-title" style={{ marginBottom: 8 }}>{data.title || 'Titre de la bannière'}</h4>
          <p style={{ color: '#d1d5e1' }}>{data.text || 'Texte de la bannière...'}</p>
        </div>
      );
    case 'video':
      return (
        <div>
          {data.videoUrl ? <p>URL: {data.videoUrl}</p> : <p>Aucune URL de vidéo</p>}
          {data.embedCode ? <p>Code embed fourni</p> : null}
        </div>
      );
    case 'button':
      return (
        <div>
          <button className="btn btn-primary">{data.text || 'Texte du bouton'}</button>
          <p style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>URL: {data.url || '#'}</p>
        </div>
      );
    default:
      return <p>Type de composant inconnu</p>;
  }
}

const placeholder: React.CSSProperties = {
  background: 'rgba(100, 181, 246, 0.1)',
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  marginBottom: 10,
};

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1976d2, #2196f3)',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

export default ComponentPreview;

