import { Table, Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();

  const statusChangeHandler = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, deliveryStatus: newStatus });
      refetch();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Form.Control
                    as='select'
                    value={order.deliveryStatus}
                    onChange={(e) => statusChangeHandler(order._id, e.target.value)}
                    disabled={loadingUpdate}
                  >
                    <option value='pending'>Pending</option>
                    <option value='packing'>Packing</option>
                    <option value='shipped'>Shipped</option>
                    <option value='out for delivery'>Out for Delivery</option>
                    <option value='delivered'>Delivered</option>
                  </Form.Control>
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/order/${order._id}`}
                    variant='light'
                    className='btn-sm'
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
