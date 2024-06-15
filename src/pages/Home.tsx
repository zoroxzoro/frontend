import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductQuery } from "../redux/api/ProductApi";
import { addToCart } from "../redux/reducer/cartRedeucer";
import { cartItem } from "../types/types";
import Loader from "../components/Loader";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Loader />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
