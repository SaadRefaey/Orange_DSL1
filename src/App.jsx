import { useMemo, useState } from 'react';
import { FLOWS, NODES, HOW_TO_OPEN, TOOLS } from './data/flows.js';
import NodeCard from './components/NodeCard.jsx';
import SrTable from './components/SrTable.jsx';

const flowOf = (id) => FLOWS.find((f) => f.id === id);

export default function App() {
  const [tab, setTab] = useState('flows');
  const [flowId, setFlowId] = useState(null);
  const [path, setPath] = useState([]);
  const [q, setQ] = useState('');

  const go = (id) => {
    if (!NODES[id]) return;
    setPath((p) => [...p, id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startFlow = (id) => { setFlowId(id); setPath([flowOf(id).start]); setTab('flows'); setQ(''); };
  const openNode = (id) => { setFlowId(null); setPath([id]); setTab('flows'); setQ(''); };
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const restart = () => setPath(flowId ? [flowOf(flowId).start] : []);
  const home = () => { setFlowId(null); setPath([]); };

  const results = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (k.length < 2) return [];
    return Object.entries(NODES)
      .filter(([, n]) => [n.t, n.d, n.sr?.code, n.sr?.area, ...(n.s || [])].join(' ').toLowerCase().includes(k))
      .slice(0, 12);
  }, [q]);

  const current = path.length ? NODES[path[path.length - 1]] : null;

  return (
    <div className="app">
      <header className="top">
        <button className="brand" type="button" onClick={() => { home(); setTab('flows'); }}>
          <span className="logo" aria-hidden="true" />
          <span><strong>Orange DSL</strong> Physical Workflows</span>
        </button>
        <nav aria-label="Sections">
          <button type="button" className={tab === 'flows' ? 'on' : ''} onClick={() => setTab('flows')}>Workflows</button>
          <button type="button" className={tab === 'sr' ? 'on' : ''} onClick={() => setTab('sr')}>SR codes</button>
          <button type="button" className={tab === 'tools' ? 'on' : ''} onClick={() => setTab('tools')}>Tools</button>
        </nav>
      </header>

      <main>
        {tab === 'flows' && (
          <>
            <input className="search" placeholder="Search a problem, SR code or script…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
            {results.length > 0 && (
              <ul className="results">
                {results.map(([id, n]) => (
                  <li key={id}><button type="button" onClick={() => openNode(id)}><strong>{n.t}</strong>{n.sr && <span className="code">{n.sr.code}</span>}</button></li>
                ))}
              </ul>
            )}

            {!current && (
              <>
                <h1 className="page-title">Choose the problem</h1>
                <div className="grid">
                  {FLOWS.map((f) => (
                    <button key={f.id} type="button" className="tile" onClick={() => startFlow(f.id)}>
                      <span className="ico" aria-hidden="true">{f.icon}</span>
                      <strong>{f.title}</strong>
                      <small>{f.about}</small>
                      {HOW_TO_OPEN[f.title] && <small className="path">{HOW_TO_OPEN[f.title]}</small>}
                    </button>
                  ))}
                </div>
              </>
            )}

            {current && (
              <>
                <div className="bar">
                  <button type="button" className="btn ghost" onClick={back} disabled={path.length < 2}>← Back</button>
                  <button type="button" className="btn ghost" onClick={restart}>↺ Restart</button>
                  <button type="button" className="btn ghost" onClick={home}>All problems</button>
                </div>
                <ol className="crumbs">
                  {path.map((id, i) => <li key={id + i} className={i === path.length - 1 ? 'now' : ''}>{NODES[id].t}</li>)}
                </ol>
                <NodeCard key={path.length + path[path.length - 1]} node={current} onChoose={go} />
              </>
            )}
          </>
        )}

        {tab === 'sr' && <SrTable onOpen={openNode} />}

        {tab === 'tools' && (
          <div>
            <h2 className="page-title">Tools used in the workflows</h2>
            <div className="grid">
              {TOOLS.map(([n, d]) => (<div className="tile static" key={n}><strong>{n}</strong><small>{d}</small></div>))}
            </div>
          </div>
        )}
      </main>
      <footer>Built from the Physical WF deck. For training use. Always follow the latest Orange Pedia.</footer>
    </div>
  );
}
