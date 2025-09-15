import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaTrash } from 'react-icons/fa';
<<<<<<< HEAD
import '../../assets/css/Admin/CommandeData.css';

export default function CommandeData({ commandes, onView, onDelete }) {
  return (
    <div className="commande-table-container shadow-sm rounded">
      <Table hover responsive className="commande-table mb-0">
        <thead>
=======

export default function CommandeData({ commandes, onView, onDelete }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
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
<<<<<<< HEAD
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
=======
              <td>{commande.id}</td>
              <td>
                <div className="fw-medium">{commande.nom}</div>
                <div className="small text-muted">{commande.prix}</div>
              </td>
              <td>{commande.qte}</td>
              <td>{commande.prix}</td>
              <td>
                <Badge bg={commande.is_active ? 'success' : 'secondary'} className="rounded-pill">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  {commande.is_active ? 'Livré' : 'En attente'}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
<<<<<<< HEAD
                  className="action-btn me-2"
=======
                  className="me-2"
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  onClick={() => onView(commande)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
<<<<<<< HEAD
                  className="action-btn"
=======
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  onClick={() => onDelete(commande.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

<<<<<<< HEAD
      <div className="table-footer d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Affichage de 1 à {commandes.length} sur {commandes.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
=======
      <div className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="text-muted">
          Affichage de 1 à {commandes.length} sur {commandes.length} entrées
        </div>
        <Pagination className="mb-0">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={commandes.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
