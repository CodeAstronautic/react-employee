import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getEmployee,
  getCreatedEmployee,
  getUpdatedEmployee,
  getDeletedEmployee
} from "./app/api";

// Styles
import "./app.scss";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataTable from "./components/DataTable";
import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";
import Modal from "./components/Form";
import Loader from "./components/Loader";
import MySwal from "./index";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);
  const [errors, setError] = useState("")
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: ""
  });
  const [activeModal, setActiveModal] = useState({ name: "", active: false });
  const [savedUsers, setSavedUsers] = useState(users);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [tabs, setTabs] = useState(0);

  const usersLastIndex = currentPage * pageSize;
  const usersFirstIndex = usersLastIndex - pageSize;
  const currentUsers = users.slice(usersFirstIndex, usersLastIndex);

  // Setting up Modal
  const setModal = modal => {
    setActiveModal({ name: modal, active: true });
  };

  // Create Employee
  const createUser = async user => {
    console.log(user, "useruser")
    setLoading(true);
    try {
      await getCreatedEmployee(user).then(res => {
        const result = res.data;
        setError("")
        MySwal.fire({
          icon: "success",
          title: "Employee created successfully."
        }).then(() => {
          dispatch({ type: "CREATE_EMPLOYEE", data: result });
          setSavedUsers([...users, result]);
          setTabs(1)
        });
      });
    } catch (err) {
      setError("")
      MySwal.fire({
        icon: "error",
        title: "Failed to create employee."
      });
    } finally {
      setLoading(false);
    }
  };

  // Update Employee
  const updateRow = user => {
    setModal("Update Employee");

    setCurrentUser({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
  };

  const updateUser = async (id, updatedUser) => {
    setActiveModal(false);
    setLoading(true);

    try {
      await getUpdatedEmployee(id, updatedUser).then(res => {
        const result = res.data;
        MySwal.fire({
          icon: "success",
          title: "Employee updated successfully."
        }).then(() => {
          dispatch({
            type: "SET_EMPLOYEES",
            data: users.map(user =>
              user.id === id ? Object.assign(user, result) : user
            )
          });
        });
      });
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Failed to update user."
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Employee
  const deleteRow = user => {
    setModal("Delete Employee");
    setCurrentUser({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
  };

  const deleteUser = async id => {
    setActiveModal(false);
    setLoading(true);
    try {
      await getDeletedEmployee(id).then(() => {
        MySwal.fire({
          icon: "success",
          title: "Employee deleted successfully."
        }).then(() => {
          dispatch({
            type: "SET_EMPLOYEES",
            data: users.filter(user => user.id !== id)
          });
          setSavedUsers(savedUsers.filter(user => user.id !== id));
          setCurrentPage(1);
        });
      });
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Failed to delete employee."
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      await getEmployee().then(({ data }) => {
        setSavedUsers(data.data);
        dispatch({ type: "SET_EMPLOYEES", data: data.data });
      });
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Failed to fetch users."
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="content">
        <div className="container">
          {loading ? (
            <Loader />
          ) : (
            <div className="content-wrapper">
              <div className="content-tab">
                <p onClick={() => setTabs(0)} className={tabs === 0 ? "tabs" : "regular-tab"}>Tab one</p>
                <p onClick={() => setTabs(1)} className={tabs === 1 ? "tabs" : "regular-tab"}>Tab two</p>
              </div>
              {tabs === 0 && <div className="toolbar">
                <CreateUser
                  createUser={createUser}
                  setError={setError}
                  errors={errors}
                />
              </div>}
              {tabs === 1 ? <DataTable
                users={currentUsers}
                updateRow={updateRow}
                deleteRow={deleteRow}
              /> : null}

            </div>
          )}
        </div>
      </main>
      {activeModal.active && (
        <Modal activeModal={activeModal}>
          {activeModal.name === "Create Employee" && (
            <CreateUser
              createUser={createUser}
            />
          )}
          {activeModal.name === "Update Employee" && (
            <UpdateUser
              currentUser={currentUser}
              updateUser={updateUser}
              setActiveModal={setActiveModal}
            />
          )}
          {activeModal.name === "Delete Employee" && (
            <DeleteUser
              currentUser={currentUser}
              deleteUser={deleteUser}
              setActiveModal={setActiveModal}
            />
          )}
        </Modal>
      )}
      <Footer />
    </div>
  );
}

export default App;
