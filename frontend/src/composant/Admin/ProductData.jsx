import { Table, Badge, Button, Pagination } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function ProductData({ products, onView, onEdit, onDelete }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
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
                  onClick={() => onView(product)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(product)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(product.id)}
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
          Affichage de 1 à {products.length} sur {products.length} entrées
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={products.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
