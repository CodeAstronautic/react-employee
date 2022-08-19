import axios from "axios";

const apiURL = process.env.REACT_APP_REQRES_API;

function getEmployee() {
  const response = axios.get(`${apiURL}/users`);

  return response;
}

function getCreatedEmployee({ first_name, last_name, email }) {
  const response = axios.post(`${apiURL}/users`, {
    email,
    first_name,
    last_name
  });

  return response;
}

function getUpdatedEmployee(id, user) {
  const response = axios.put(`${apiURL}/users/${id}`, {
    id: id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });

  return response;
}

function getDeletedEmployee(id) {
  const response = axios.delete(`${apiURL}/users/${id}`);

  return response;
}

export { getEmployee, getCreatedEmployee, getUpdatedEmployee, getDeletedEmployee };
