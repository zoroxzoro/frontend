import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/Reducer.types";
import {
  useDeleteProductMutation,
  useProductDetailesQuery,
  useUpdateProductMutation,
} from "../../../redux/api/ProductApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { responseToast } from "../../../utils/features";
import Loader from "../../../components/Loader";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailesQuery(params.id!);

  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>("");
  const [photoUpdate, setPhotoUpdate] = useState<string | undefined>();
  const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    // Ensure userId and productId are defined and convert them to strings if possible
    const res = await updateProduct({
      formData,
      userId: user?._id ?? "", // Provide a default empty string if user._id is undefined
      productId: data?.product?._id ?? "", // Provide a default empty string if product._id is undefined
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id ?? "",
      productId: data?.product?._id ?? "",
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setPhotoUpdate(data.product.photo); // Set the initial photo URL
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={photoUpdate} alt="Product" />{" "}
              {/* Display the fetched photo */}
              <p>{nameUpdate}</p>
              {stockUpdate > 0 ? (
                <span className="green">{stockUpdate} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{priceUpdate}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>
                {photoUpdate && <img src={photoUpdate} alt="New Image" />}{" "}
                {/* Show updated image preview */}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
