import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
<<<<<<< HEAD
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
=======

export default function CustomerData({ customers }) {
  return (
    <div className="border rounded overflow-hidden">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
            <th>Email</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
<<<<<<< HEAD
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
=======
              <td>{customer.id}</td>
              <td>
                <div className="fw-medium">{customer.username} </div>
                <div className="small text-muted">{customer.email}</div>
              </td>
              <td>{customer.full_name}</td>
              <td>{customer.email}</td>
            
              <td>
                <Badge bg={customer.is_active ? 'success' : 'secondary'} className="rounded-pill">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
                  {customer.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="text-end">
<<<<<<< HEAD
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
=======
                <Button variant="outline-primary" size="sm" className="me-2">
                  <FaEye />
                </Button>
                <Button variant="outline-success" size="sm" className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
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
          Affichage de 1 à {customers.length} sur {customers.length} entrées
        </div>
        <Pagination className="mb-0 pagination-custom">
=======
      
      <div className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="text-muted">
          Affichage de 1 à {customers.length} sur {customers.length} entrées
        </div>
        <Pagination className="mb-0">
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled={customers.length <= 10} />
        </Pagination>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
