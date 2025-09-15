<<<<<<< HEAD
import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../assets/css/Admin/ProductData.css';

export default function ProductData({ products, onView, onEdit, onDelete }) {
  return (
    <div className="product-table-container shadow-sm rounded">
      <Table hover responsive className="product-table mb-0">
        <thead>
=======
import { Table, Badge, Button, Pagination } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function ProductData({ products, onView, onEdit, onDelete }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prix</th>
<<<<<<< HEAD
            <th>Qte</th>
=======
            <th>Quantité</th>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
            <th>Catégorie</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
<<<<<<< HEAD
              <td className="fw-semibold">{product.id}</td>
              <td>
                <div className="fw-bold text-dark">{product.nom}</div>
                <div className="small text-muted">Réf: {product.ref || "N/A"}</div>
              </td>
              <td className="text-primary fw-semibold">{product.prix} €</td>
              <td>{product.qte}</td>
              <td className="text-capitalize">{product.categorie}</td>
              <td>
                <Badge 
                  bg={product.is_active ? 'success' : 'danger'} 
                  className="status-badge"
                >
                  {product.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="text-end">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="action-btn me-2" 
=======
              <td>{product.id}</td>
              <td>{product.nom}</td>
              <td>{product.prix}</td>
              <td>{product.qte}</td>
              <td>{product.categorie_id}</td>
              <td>
                <Badge bg={product.is_active ? "success" : "secondary"} className="rounded-pill">
                  {product.is_active ? "Actif" : "Inactif"}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  onClick={() => onView(product)}
                >
                  <FaEye />
                </Button>
<<<<<<< HEAD
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  className="action-btn me-2" 
=======
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  onClick={() => onEdit(product)}
                >
                  <FaEdit />
                </Button>
<<<<<<< HEAD
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="action-btn" 
=======
                <Button
                  variant="outline-danger"
                  size="sm"
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  onClick={() => onDelete(product.id)}
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
          Affichage de 1 à {products.length} sur {products.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
=======
      <div className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="text-muted">
          Affichage de 1 à {products.length} sur {products.length} entrées
        </div>
        <Pagination className="mb-0">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={products.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
