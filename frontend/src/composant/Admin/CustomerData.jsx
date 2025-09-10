import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../assets/css/Admin/CustomerData.css';

export default function CustomerData({ customers }) {
  return (
    <div className="customer-table-container shadow-sm rounded">
      <Table hover responsive className="customer-table mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Password</th>
            <th>Email</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td className="fw-semibold">{customer.id}</td>
              <td>
                <div className="fw-bold text-dark">{customer.nom}</div>
                <div className="small text-muted">{customer.email}</div>
              </td>
              <td className="text-muted">{customer.password}</td>
              <td>{customer.email}</td>
              <td>
                <Badge
                  bg={customer.is_active ? 'success' : 'danger'}
                  className="status-badge"
                >
                  {customer.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="action-btn me-2"
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="action-btn me-2"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="action-btn"
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
          Affichage de 1 à {customers.length} sur {customers.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={customers.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}
