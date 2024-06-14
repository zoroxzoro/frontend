import { Link } from "react-router-dom";
import SwiperComponent from "../components/Swiper";
import ProductCard from "../components/ProductCard";
import { useLatestProductQuery } from "../redux/api/ProductApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartRedeucer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductQuery("");
  if (isError) return toast.error("Cannot Fetch Products");
  const dispatch = useDispatch();
  const AddToCart = (cartItems: CartItem) => {
    if (cartItems.stock < 1) return toast.error("Product is Out of Stock");
    toast.success("Product Added to Cart");
    dispatch(addToCart(cartItems));
  };
  return (
    <div>
      <section className="section">
        <SwiperComponent />
      </section>

      <h1
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "2rem",
          padding: "1.5rem",
        }}
      >
        Latest Product
        <Link to={"/search"} className="findMore">
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
              stock={i.price}
              handler={AddToCart}
              photo={i.photo}
            />
          ))
        )}
        <div></div>
      </main>
    </div>
  );
};

export default Home;
