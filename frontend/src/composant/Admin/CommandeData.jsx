import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaTrash } from 'react-icons/fa';
import '../../assets/css/Admin/CommandeData.css';

export default function CommandeData({ commandes, onView, onDelete }) {
  return (
    <div className="commande-table-container shadow-sm rounded">
      <Table hover responsive className="commande-table mb-0">
        <thead>
          <tr>
            <th>ID_CMD</th>
            <th>Nom</th>
            <th>Qte</th>
            <th>Prix</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(commande => (
            <tr key={commande.id}>
              <td className="fw-semibold">{commande.id}</td>
              <td>
                <div className="fw-bold text-dark">{commande.nom}</div>
                <div className="small text-muted">Réf: {commande.ref || "N/A"}</div>
              </td>
              <td>{commande.qte}</td>
              <td className="text-primary fw-semibold">{commande.prix} €</td>
              <td>
                <Badge
                  bg={commande.is_active ? 'success' : 'warning'}
                  className="status-badge"
                >
                  {commande.is_active ? 'Livré' : 'En attente'}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="action-btn me-2"
                  onClick={() => onView(commande)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="action-btn"
                  onClick={() => onDelete(commande.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="table-footer d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Affichage de 1 à {commandes.length} sur {commandes.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={commandes.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
