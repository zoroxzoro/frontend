import { useEffect } from "react";
import { useGetSingleProductQuery } from "../redux/api/ProductApi"; // Adjust the path as per your project structure
import { FaPlus } from "react-icons/fa";
import { cartItem } from "../types/types";

type ProductDetailsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: cartItem) => string | undefined; // Assuming productId is passed as prop or retrieved from state
};

const ProductDetails = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductDetailsProps) => {
  const {
    data: product,
    error,
    isLoading,
  } = useGetSingleProductQuery(productId);

  useEffect(() => {
    // Optionally handle loading state or error
  }, [isLoading, error]);

  if (isLoading) return <p>Loading...</p>;

  if (!product) return null; // Handle case when product is not found

  return (
    <div className="product-card">
      <img src={product.product.photo} alt={product.product.name} />
      <p>{product.product.name}</p>
      <span>Price: ₹{product.product.price}</span>
      <div>
        <button
          onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
      </div>
      {/* Add more product details as needed */}
    </div>
  );
};

export default ProductDetails;
