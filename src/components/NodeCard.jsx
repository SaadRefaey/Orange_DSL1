import { useState } from 'react';

function CopyButton({ text }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {
      window.prompt('Copy:', text);
    }
  };
  return (
    <button className="btn ghost" onClick={copy} type="button">
      {ok ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

function SrBox({ sr, label }) {
  const rows = [['Type', sr.type], ['Area', sr.area], ['Sub Area', sr.sub], ['Product', sr.product], ['Owner Group', sr.owner], ['SLA', sr.sla]].filter(([, v]) => v);
  return (
    <section className="box sr">
      <h3>{label} <span className="code">{sr.code}</span></h3>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
    </section>
  );
}

export default function NodeCard({ node, onChoose }) {
  return (
    <article className="card">
      <h2>{node.t}</h2>
      <p className="text">{node.d}</p>

      {node.tab && (
        <div className="scroll">
          <table>
            <thead><tr>{node.tab[0].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {node.tab.slice(1).map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {node.sr && <SrBox sr={node.sr} label="Siebel SR" />}
      {node.sr2 && <SrBox sr={node.sr2} label="Siebel SR (2)" />}

      {node.s && node.s.map((s, i) => (
        <section className="box script" key={i}>
          <h3>Script</h3>
          <p dir="rtl" lang="ar">{s}</p>
          <CopyButton text={s} />
        </section>
      ))}

      {node.esc && (
        <section className="box esc"><h3>Escalation</h3><p>{node.esc}</p></section>
      )}

      {node.c && (
        <div className="choices">
          {node.c.map(([label, to]) => (
            <button key={label} className="btn choice" onClick={() => onChoose(to)} type="button">
              {label} <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
