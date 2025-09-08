import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { COMPONENT_SCHEMAS, createEmptyComponent } from './types';
import type { ComponentType, PageComponent, PageDataModel } from './types';
import { savePageData, loadPageData } from './storage';
import { toJson, toXml } from './exports';
import ComponentGallery from './components/ComponentGallery';
import ComponentForm from './components/ComponentForm';
import SortableComponents from './components/SortableComponents';

function App() {
  const [pageName, setPageName] = useState<string>('Ma nouvelle page');
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ item: PageComponent; index: number } | null>(null);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const loaded = loadPageData();
    if (loaded) {
      setPageName(loaded.pageName || 'Ma nouvelle page');
      setComponents(loaded.components || []);
    }
  }, []);

  useEffect(() => {
    const data: PageDataModel = { pageName, components };
    savePageData(data);
  }, [pageName, components]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addComponent = (type: ComponentType) => {
    const created = createEmptyComponent(type);
    setComponents((prev) => {
      const next = [...prev, created];
      setEditingIndex(next.length - 1);
      return next;
    });
    setShowGallery(false);
  };

  const moveComponent = (index: number, delta: number) => {
    setComponents((prev) => {
      const next = [...prev];
      const newIndex = index + delta;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
    notify('Composant déplacé avec succès!');
  };

  const deleteComponent = (index: number) => {
    setComponents((prev) => {
      const removed = prev[index];
      setLastDeleted({ item: removed, index });
      return prev.filter((_, i) => i !== index);
    });
    notify('Composant supprimé. Annuler ?');
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    setComponents((prev) => {
      const next = [...prev];
      next.splice(lastDeleted.index, 0, lastDeleted.item);
      return next;
    });
    setLastDeleted(null);
    notify('Suppression annulée');
  };

  const exportJson = () => {
    const data: PageDataModel = { pageName, components };
    const blob = new Blob([toJson(data)], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pageName.replace(/\s+/g, '_')}_data.json`;
    a.click();
    notify('Export JSON réussi!');
  };

  const exportXml = () => {
    const data: PageDataModel = { pageName, components };
    const blob = new Blob([toXml(data)], { type: 'application/xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pageName.replace(/\s+/g, '_')}_data.xml`;
    a.click();
    notify('Export XML réussi!');
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentEditing = useMemo(() => (editingIndex !== null ? components[editingIndex] : null), [editingIndex, components]);

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <header className="header">
        <h1 className="title shiny-text display-font">LDBPRO - Designer</h1>
        <p className="subtitle">Créez des pages web modernes et responsive</p>
        <div className="row-center">
          <button className="btn btn-ghost btn-sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </button>
        </div>
        <div className="input-wrap">
          <input
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Ma nouvelle page"
            className={`page-input ${!pageName?.trim() ? 'required' : ''}`}
          />
          {!pageName?.trim() && (
            <div className="input-hint">Veuillez renseigner le nom de votre page</div>
          )}
        </div>
      </header>

      <main className="main-card">

        {components.length === 0 ? (
          <div className="empty">
            <span className="empty-title display-font shiny-text">Aucun composant ajouté.</span>
            <div className="text-muted" style={{ marginTop: 8 }}>Cliquez sur + pour ajouter votre premier composant.</div>
          </div>
        ) : (
          <SortableComponents
            items={components}
            onReorder={(next) => setComponents(next)}
            onEdit={(i) => setEditingIndex(i)}
            onDelete={(i) => deleteComponent(i)}
            onMoveUp={(i) => moveComponent(i, -1)}
            onMoveDown={(i) => moveComponent(i, 1)}
          />
        )}
      </main>

      {/* Floating Add Button */}
      <div className="fab-center">
        <div className="fab-group">
          <button className="fab fab--add" aria-label="Ajouter un composant" onClick={() => setShowGallery(true)}>+</button>
          <button className="fab fab--validate" aria-label="Exporter" onClick={() => { exportJson(); exportXml(); }}>✓</button>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="modal-overlay" onClick={() => setShowGallery(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ color: '#90caf9', margin: 0 }}>Ajouter un composant</h2>
              <button onClick={() => setShowGallery(false)} className="btn btn-ghost btn-mini">×</button>
            </div>
            <ComponentGallery onPick={addComponent} />
          </div>
        </div>
      )}

      {currentEditing && (
        <div className="modal-overlay" onClick={() => setEditingIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ color: '#90caf9', margin: 0 }}>Éditer: {COMPONENT_SCHEMAS[currentEditing.type].name}</h2>
              <button onClick={() => setEditingIndex(null)} className="btn btn-ghost btn-mini">×</button>
            </div>
            <ComponentForm
              schema={COMPONENT_SCHEMAS[currentEditing.type]}
              value={currentEditing}
              onChange={(next) =>
                setComponents((prev) => prev.map((c, i) => (i === editingIndex ? next : c)))
              }
              onSubmit={() => {
                setEditingIndex(null);
                notify('Composant mis à jour avec succès!');
              }}
            />
          </div>
        </div>
      )}

      {notification && (
        <div className="toast">
          <span>{notification}</span>
          {lastDeleted ? (
            <button
              type="button"
              onClick={undoDelete}
              className="btn btn-ghost btn-mini mt-2"
            >
              Annuler
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;


