import React from 'react';
import { portfolioContent } from '../content/portfolioContent';

export default function ImpactMetrics() {
    const metrics = portfolioContent.metrics || [];

    if (!metrics.length) return null;

    return (
        <section className="container" style={{ marginBottom: '64px' }}>
            <div className="section-label">Key Impact Metrics</div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
            }}>
                {metrics.map((m, i) => (
                    <div key={i} className="glass animate-fade-up" style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        animationDelay: `${i * 0.1}s`
                    }}>
                        <div style={{
                            fontSize: '32px',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--accent)',
                            marginBottom: '4px'
                        }}>{m.value}</div>
                        <div style={{
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                            marginBottom: '8px'
                        }}>{m.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{m.sub}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
