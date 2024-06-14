import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/Reducer.types";
import { useAllProductQuery } from "../../redux/api/ProductApi";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { serverr } from "../../components/ProductCard";
import Loader from "../../components/Loader";

interface DataType {
  photo: React.ReactElement;
  name: string;
  price: number;
  stock: number;
  action: React.ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const [data, setData] = useState<DataType[]>([]);
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const {
    isLoading,
    isError,
    error,
    data: queryData,
  } = useAllProductQuery(user?._id || "");

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (queryData) {
      setData(
        queryData.products.map((i) => ({
          photo: <img src={`${serverr}${i.photo}`} alt={i.name} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [queryData]);

  const Table = (
    <TableHOC<DataType>
      columns={columns}
      data={data}
      containerClassName="dashboard-product-box"
      heading="Products"
      showPagination={data.length > 6}
    />
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Loader /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
