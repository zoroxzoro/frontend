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

const Customers = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { isLoading, isError, data, error } = useAllUsersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();

  // Handle error toast
  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  // Effect to update rows when data changes
  useEffect(() => {
    if (data) {
      const updatedRows = data.users.map((user) => ({
        avatar: <img src={user.photo} style={{ borderRadius: "50%" }} />,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        action: (
          <button onClick={() => deleteHandler(user._id)}>
            <FaTrash />
          </button>
        ),
      }));
      setRows(updatedRows);
    }
  }, [data]); // Update rows when data changes

  // Function to handle user deletion
  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });
    responseToast(res, null, ""); // Handle response toast
  };

  // Define table columns
  const columns: Column<DataType>[] = [
    { Header: "Avatar", accessor: "avatar" },
    { Header: "Name", accessor: "name" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
    { Header: "Action", accessor: "action" },
  ];

  // Render the table component
  const Table = TableHOC<DataType>({
    columns,
    data: rows,
    containerClassName: "dashboard-product-box",
    heading: "Customers",
    showPagination: rows.length > 6,
  });

  return (
    <div className="admin-container">
      {isLoading ? <Loader /> : <AdminSidebar />}
      <main>
        <Table /> {/* Render the Table component */}
      </main>
    </div>
  );
};

export default Customers;
