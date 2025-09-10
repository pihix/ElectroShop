import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../assets/css/Admin/ProductData.css';

export default function ProductData({ products, onView, onEdit, onDelete }) {
  return (
    <div className="product-table-container shadow-sm rounded">
      <Table hover responsive className="product-table mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Qte</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
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
                  onClick={() => onView(product)}
                >
                  <FaEye />
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  className="action-btn me-2" 
                  onClick={() => onEdit(product)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="action-btn" 
                  onClick={() => onDelete(product.id)}
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
          Affichage de 1 à {products.length} sur {products.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={products.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
