import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery, useSearchQuery } from "../redux/api/ProductApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { cartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartRedeucer";
import { useDispatch } from "react-redux";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [MaxPrice, setMaxPrice] = useState(10000);
  const [category, SetCategory] = useState("");
  const [page, setPage] = useState(1);
  const isPrev = page > 1;
  const isNext = page < 4;

  const dispatch = useDispatch();
  const AddToCart = (cartItems: cartItem) => {
    if (cartItems.stock < 1) return toast.error("Product is Out of Stock");
    toast.success("Product Added to Cart");
    dispatch(addToCart(cartItems));
  };

  const {
    data: catagoriesResponse,
    isLoading: loadingCatagories,
    isError,
    error,
  } = useCategoriesQuery("");

  const {
    isLoading: ProductLoading,
    data: SearchData,
    isError: ProductIsError,
    error: ProductError,
  } = useSearchQuery({
    search,
    sort,
    category,
    page,
    price: MaxPrice,
  });

  console.log(SearchData);
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (ProductIsError) {
    const err = ProductError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="Search">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low To High)</option>
            <option value="dsc">Price (High To Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price:{MaxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={MaxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => SetCategory(e.target.value)}
          >
            <option value="">All</option>
            {!loadingCatagories &&
              catagoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search By Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {ProductLoading ? (
          <Loader />
        ) : (
          <div className="Search-pro-list">
            {SearchData?.products.map((i) => (
              <ProductCard
                productId={i._id}
                key={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={AddToCart}
                photo={i.photo}
              />
            ))}
          </div>
        )}
        {SearchData && SearchData.totalPage >= 1 && (
          <article style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              disabled={!isPrev}
              onClick={() => setPage((prev) => prev - 1)}
              style={{ margin: "0 0.5rem" }}
            >
              Prev
            </button>
            <span>
              {page} of {SearchData.totalPage}
            </span>
            <button
              disabled={!isNext}
              onClick={() => setPage((prev) => prev + 1)}
              style={{ margin: "0 0.5rem" }}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
