'use client';

import { useId, useState } from 'react';
import { FiActivity, FiTrendingUp } from 'react-icons/fi';
import { compactMoney, money, statusLabel } from '@/utils/presentation';
import styles from './charts.module.css';

type MonthValue = { key: string; label: string; valor: number };
type Status = 'pendente' | 'entregue' | 'devolvido';
const statuses: Status[] = ['pendente', 'entregue', 'devolvido'];
const colors: Record<Status, string> = {
  pendente: '#dfac52',
  entregue: '#6d96c5',
  devolvido: '#258573',
};

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

export function MonthlyChart({
  historico,
  receitaMensal,
}: {
  historico: MonthValue[];
  receitaMensal: number;
}) {
  const gradientId = useId().replace(/:/g, '');
  const [selected, setSelected] = useState(5);
  const active = Math.min(selected, historico.length - 1);
  const maior = Math.max(...historico.map(month => month.valor), 0);
  const magnitude = 10 ** Math.floor(Math.log10(maior || 100));
  const upper =
    ([1, 2, 5, 10].find(step => step * magnitude >= maior) ?? 10) * magnitude;
  const scale = maior ? upper : 100;
  const points = historico.map((month, index) => ({
    x: 62 + index * (550 / Math.max(1, historico.length - 1)),
    y: 207 - (month.valor / scale) * 165,
  }));
  const line = points
    .map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`)
    .join(' ');
  const area = points.length
    ? `${line} L ${points.at(-1)!.x} 207 L ${points[0].x} 207 Z`
    : '';

  return (
    <section
      className={`panel ${styles.panel}`}
      aria-labelledby={`${gradientId}-title`}
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>EVOLUÇÃO DOS ALUGUÉIS</p>
          <h2 id={`${gradientId}-title`}>Seu negócio ao longo dos meses</h2>
        </div>
        <span className={styles.icon}>
          <FiTrendingUp size={20} />
        </span>
      </div>
      <div className={styles.chartTop}>
        <div>
          <strong className={styles.amount}>{money(receitaMensal)}</strong>
          <p>Total do mês selecionado</p>
        </div>
        <span className={styles.pill}>
          <i /> Últimos 6 meses
        </span>
      </div>
      <div className={styles.detail} aria-live="polite">
        <span>
          {historico[active]
            ? monthLabel(historico[active].key)
            : 'Sem período'}
        </span>
        <strong>{money(historico[active]?.valor ?? 0)}</strong>
      </div>
      <figure className={styles.figure}>
        <figcaption className="visually-hidden">
          Valores contratados por mês de entrega. Selecione um mês para
          consultar o valor.
        </figcaption>
        <svg
          viewBox="0 0 640 230"
          className={styles.areaChart}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#258573" stopOpacity=".25" />
              <stop offset="100%" stopColor="#258573" stopOpacity=".015" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map(tick => {
            const y = 207 - tick * 41.25;
            return (
              <g key={tick}>
                <line
                  x1="62"
                  x2="612"
                  y1={y}
                  y2={y}
                  className={styles.gridLine}
                />
                <text x="0" y={y + 4} className={styles.axisLabel}>
                  {compactMoney((scale * tick) / 4)}
                </text>
              </g>
            );
          })}
          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line} className={styles.trendLine} />
          {points[active] && (
            <line
              x1={points[active].x}
              x2={points[active].x}
              y1="32"
              y2="207"
              className={styles.crosshair}
            />
          )}
          {points.map((point, index) => (
            <g key={historico[index].key}>
              <rect
                x={point.x - 40}
                y="20"
                width="80"
                height="190"
                fill="transparent"
                onMouseEnter={() => setSelected(index)}
                onClick={() => setSelected(index)}
              />
              {index === active && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill="#258573"
                  opacity=".12"
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={index === active ? 5 : 3.5}
                className={styles.point}
                pointerEvents="none"
              />
            </g>
          ))}
        </svg>
        <div className={styles.months}>
          {historico.map((month, index) => (
            <button
              type="button"
              key={month.key}
              className={index === active ? styles.activeMonth : ''}
              aria-pressed={index === active}
              aria-label={`${monthLabel(month.key)}: ${money(month.valor)}`}
              onFocus={() => setSelected(index)}
              onMouseEnter={() => setSelected(index)}
              onClick={() => setSelected(index)}
            >
              {month.label}
            </button>
          ))}
        </div>
      </figure>
      {maior === 0 && (
        <p className={styles.emptyNote}>
          Nenhum valor contratado nos meses exibidos.
        </p>
      )}
      <p className={styles.footnote}>
        <span className={styles.legendDot} /> Valores contratados por mês de
        entrega, incluindo frete. O cadastro atual não registra pagamentos
        recebidos.
      </p>
    </section>
  );
}

export function StatusChart({
  status,
  total,
  ticketMedio,
}: {
  status: Record<Status, number>;
  total: number;
  ticketMedio: number;
}) {
  const titleId = useId();
  let offset = 0;
  return (
    <section className={`panel ${styles.panel}`} aria-labelledby={titleId}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>DISTRIBUIÇÃO POR STATUS</p>
          <h2 id={titleId}>Como está o mês?</h2>
        </div>
        <span className={styles.icon}>
          <FiActivity size={20} />
        </span>
      </div>
      <div className={styles.donutWrap}>
        <svg className={styles.donut} viewBox="0 0 180 180" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="#edf2ef"
            strokeWidth="16"
          />
          {statuses.map(key => {
            const fraction = total ? (status[key] / total) * 100 : 0;
            const start = offset;
            offset += fraction;
            if (!fraction) return null;
            const visible = Math.max(fraction * 0.75, fraction - 1.6);
            return (
              <circle
                key={key}
                cx="90"
                cy="90"
                r="70"
                pathLength="100"
                fill="none"
                stroke={colors[key]}
                strokeWidth="16"
                strokeDasharray={`${visible} ${100 - visible}`}
                strokeDashoffset={-start}
                transform="rotate(-90 90 90)"
              >
                <title>
                  {statusLabel[key]}: {status[key]} ({fraction.toFixed(0)}%)
                </title>
              </circle>
            );
          })}
        </svg>
        <div className={styles.donutCenter}>
          <strong>{total.toString().padStart(2, '0')}</strong>
          <span>{total === 1 ? 'aluguel no mês' : 'aluguéis no mês'}</span>
        </div>
      </div>
      <div className={styles.statusList}>
        {statuses.map(key => (
          <div className={styles.statusRow} key={key}>
            <span>
              <i style={{ background: colors[key] }} />
              {statusLabel[key]}
            </span>
            <div>
              <small>
                {total ? Math.round((status[key] / total) * 100) : 0}%
              </small>
              <strong>{status[key].toString().padStart(2, '0')}</strong>
            </div>
          </div>
        ))}
      </div>
      {total === 0 && (
        <p className={styles.emptyNote}>Nenhum aluguel no mês selecionado.</p>
      )}
      <div className={styles.ticket}>
        <span>Valor médio por aluguel</span>
        <strong>{money(ticketMedio)}</strong>
      </div>
    </section>
  );
}
