import styles from './rentals.module.css';

export default function RentalsTable() {
  return (
    <section className={styles.tableSection}>
      <h2 className={styles.sectionTitle}>Aluguéis Recentes</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Entrega</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                nome: 'Maria Souza',
                tel: '(11) 98765-4321',
                itens: '10 Cadeiras, 2 Mesas, 2 forros',
                data: '15/06/2023',
                valor: 'R$ 210,00',
                status: 'Concluído',
                statusTone: 'success',
              },
              {
                nome: 'Carlos Oliveira',
                tel: '(11) 91234-5678',
                itens: '12 Cadeiras, 3 Mesas, 3 forros',
                data: '17/06/2023',
                valor: 'R$ 185,00',
                status: 'Pendente',
                statusTone: 'warn',
              },
              {
                nome: 'Ana Santos',
                tel: '(11) 94567-8901',
                itens: '20 Cadeiras, 5 Mesas, 5 forros',
                data: '20/06/2023',
                valor: 'R$ 540,00',
                status: 'Em andamento',
                statusTone: 'info',
              },
            ].map((r, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.clientCell}>
                    <div>
                      <div className={styles.clientName}>{r.nome}</div>
                      <div className={styles.clientPhone}>{r.tel}</div>
                    </div>
                  </div>
                </td>
                <td>{r.itens}</td>
                <td>
                  <div>{r.data}</div>
                  <div className={styles.subtle}>
                    mostrar hora/talvez endereço
                  </div>
                </td>
                <td>{r.valor}</td>
                <td>
                  <span className={`${styles.badge} ${styles[r.statusTone]}`}>
                    {r.status}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.linkBtn}>Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
