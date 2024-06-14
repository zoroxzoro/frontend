import { ReactElement, useEffect, useState } from "react";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useMyOrderQuery } from "../redux/api/orderApi";
import { UserReducerInitialState } from "../types/Reducer.types";
import { CustomError } from "../types/api-types";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Order = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { isLoading, isError, data, error } = useMyOrderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    " orders",
    true
  ); // Corrected variable name to Table
  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);
  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          amount: i.total,
          quantity: i.orderItems.length,
          action: <Link to={`/admin/transection/${i._id}`}>Manage</Link>,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "purple"
                  : "green"
              }
            >
              {i.status}
            </span>
          ),
          discount: i.discount,
        }))
      );
    }
  }, [data]);
  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Loader /> : <Table />}
    </div>
  );
};

export default Order;
