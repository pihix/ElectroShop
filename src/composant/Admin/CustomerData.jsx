import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function CustomerData({ customers }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
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
              <td>{customer.id}</td>
              <td>
                <div className="fw-medium">{customer.nom} </div>
                <div className="small text-muted">{customer.email}</div>
              </td>
              <td>{customer.password}</td>
              <td>{customer.email}</td>
            
              <td>
                <Badge bg={customer.is_active ? 'success' : 'secondary'} className="rounded-pill">
                  {customer.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="text-end">
                <Button variant="outline-primary" size="sm" className="me-2">
                  <FaEye />
                </Button>
                <Button variant="outline-success" size="sm" className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <div className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="text-muted">
          Affichage de 1 à {customers.length} sur {customers.length} entrées
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={customers.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
}