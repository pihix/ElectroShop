import { Table, Button } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function CategorieData({ categories, onView, onEdit, onDelete }) {
  return (
    <Table hover responsive className="mb-0">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.name}</td>
            
            <td className="text-end">
              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(cat)}>
                <FaEye />
              </Button>
              <Button variant="outline-success" size="sm" className="me-2" onClick={() => onEdit(cat)}>
                <FaEdit />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(cat.id)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
