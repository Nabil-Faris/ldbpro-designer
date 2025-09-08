import type { ComponentType } from '../types';
import { COMPONENT_SCHEMAS } from '../types';

type Props = {
  onPick: (type: ComponentType) => void;
};

const ORDER: ComponentType[] = ['richText', 'imageBanner', 'genericBanner', 'video', 'button'];

export function ComponentGallery({ onPick }: Props) {
  return (
    <div className="grid-gallery">
      {ORDER.map((type) => (
        <button
          key={type}
          onClick={() => onPick(type)}
          className="card"
        >
          <div className="card-title" style={{ fontWeight: 600, marginBottom: 8 }}>{COMPONENT_SCHEMAS[type].name}</div>
          <div style={{ opacity: 0.8, fontSize: 14 }}>Ajouter {type}</div>
        </button>
      ))}
    </div>
  );
}

export default ComponentGallery;

