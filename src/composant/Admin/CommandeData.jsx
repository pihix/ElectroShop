import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaTrash } from 'react-icons/fa';

export default function CommandeData({ commandes, onView, onDelete }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
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
              <td>{commande.id}</td>
              <td>
                <div className="fw-medium">{commande.nom}</div>
                <div className="small text-muted">{commande.prix}</div>
              </td>
              <td>{commande.qte}</td>
              <td>{commande.prix}</td>
              <td>
                <Badge bg={commande.is_active ? 'success' : 'secondary'} className="rounded-pill">
                  {commande.is_active ? 'Livré' : 'En attente'}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onView(commande)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(commande.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="text-muted">
          Affichage de 1 à {commandes.length} sur {commandes.length} entrées
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={commandes.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
