import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { cartItem } from "../types/types";
import { useGetSingleProductQuery } from "../redux/api/ProductApi";

type CartItemProps = {
  cartItem: cartItem;
  incrementHandler: (cartItem: cartItem) => void;
  decrementHandler: (cartItem: cartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { productId, name, price, quantity } = cartItem;

  // Fetch product details including photo using productId
  const { data: product, isLoading } = useGetSingleProductQuery(productId);

  if (isLoading) return <p>Loading...</p>;

  if (!product) return null; // Handle case when product is not found

  return (
    <div className="cart-item">
      <img src={product.product.photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
