import { ReactElement, useEffect, useState } from "react";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/Reducer.types";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/UserApi";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { FaTrash } from "react-icons/fa";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { isLoading, isError, data, error } = useAllUsersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();
  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });
    responseToast(res, null, "");
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
          avatar: <img src={i.photo} style={{ borderRadius: "50%" }} />,
          email: i.email,
          gender: i.gender,
          name: i.name,
          role: i.role,
        }))
      );
    }
  }, [data]);

  return (
    <div className="admin-container">
      {isLoading ? <Loader /> : <AdminSidebar />}
      <main>{Table}</main>
    </div>
  );
};

export default Customers;
