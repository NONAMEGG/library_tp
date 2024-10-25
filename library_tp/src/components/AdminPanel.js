import { useEffect, useState } from "react";
import { supabase } from "../pages/lib/supabaseClient.js";
import './admin.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'customer', // Значение по умолчанию
  });
  const [updatedUser, setUpdatedUser] = useState({
    id: null,
    username: '',
    password: '',
    role: 'customer', // Значение по умолчанию
  });

  const fetchUsers = async () => {
    const {data, error} = await supabase
        .from("users")
        .select("*")
        .order('id', {ascending: true}); // Сортировка по ID

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    const {username, password, role} = newUser;

    const {error} = await supabase
        .from("users")
        .insert([{username, password, role}]);

    if (error) {
      console.error("Error adding user:", error);
    } else {
      alert('Пользователь добавлен успешно!');
      setNewUser({username: '', password: '', role: 'customer'}); // Сбрасываем поля
      fetchUsers(); // Обновляем список пользователей
    }
  };

  const handleEdit = (user) => {
    if (editUserId === user.id) {
      setEditUserId(null);
      setUpdatedUser({
        id: null,
        username: '',
        password: '',
        role: 'customer', // Значение по умолчанию
      });
    } else {
      setEditUserId(user.id);
      setUpdatedUser({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
      });
    }
  };

  const handleUpdate = async () => {
    const {id, username, password, role} = updatedUser;

    // Проверка на изменения
    const userInList = users.find(user => user.id === id);
    if (
        userInList.username === username &&
        userInList.password === password &&
        userInList.role === role
    ) {
      setEditUserId(null); // Сбросить режим редактирования
      return; // Убираем уведомление, если данные не изменены
    }

    const {error} = await supabase
        .from("users")
        .update({username, password, role})
        .eq('id', id);

    if (error) {
      console.error("Error updating user:", error);
    } else {
      alert('Пользователь обновлён успешно!');
      fetchUsers();
      setEditUserId(null);
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (userId) => {
    const {error} = await supabase
        .from("users")
        .delete()
        .eq('id', userId);

    if (error) {
      console.error("Error deleting user:", error);
    } else {
      alert('Пользователь удалён успешно!');
      fetchUsers();
    }
  };

  const handleNewUserChange = (e) => {
    const {name, value} = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setUpdatedUser({
      id: null,
      username: '',
      password: '',
      role: 'customer', // Значение по умолчанию
    });
  };
  return (
      <div>
        <h1>Admin Panel</h1>

        <form onSubmit={handleAddUser} className="admin-form">
          <h2>Добавить нового пользователя</h2>
          <div className="new-user-fields">
            <input
                type="text"
                name="username"
                placeholder="Логин"
                value={newUser.username}
                onChange={handleNewUserChange}
                required
            />
            <input
                type="text"
                name="password"
                placeholder="Пароль"
                value={newUser.password}
                onChange={handleNewUserChange}
                required
            />
            <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                required
            >
              <option value="admin">admin</option>
              <option value="librarian">librarian</option>
              <option value="customer">customer</option>
            </select>
          </div>
          <button type="submit" className="form-button">Добавить пользователя</button>
        </form>

        <h2>Существующие пользователи</h2>
        <ul>
          {users.map((user) => (
              <li key={user.id} className={`user-item ${user.role === 'admin' ? 'admin-role' : ''}`}>
                {editUserId === user.id ? (
                    <>
                      <span>ID: {user.id}</span>
                      <input
                          type="text"
                          name="username"
                          value={updatedUser.username}
                          onChange={handleChange}
                          placeholder="Логин"
                          required
                      />
                      <input
                          type="text"
                          name="password"
                          value={updatedUser.password}
                          onChange={handleChange}
                          placeholder="Пароль"
                          required
                      />
                      <select
                          name="role"
                          value={updatedUser.role}
                          onChange={handleChange}
                          required
                      >
                        <option value="admin">admin</option>
                        <option value="librarian">librarian</option>
                        <option value="customer">customer</option>
                      </select>
                      <div className="edit-buttons">
                        <button className="form-button" onClick={handleUpdate}>Готово</button>
                        <button className="form-button" onClick={handleCancelEdit}>Отмена</button>
                      </div>
                    </>
                ) : (
                    <>
                      <span>ID: {user.id}, Логин: {user.username} - Роль: {user.role}</span>
                      <div className="user-actions">
                        <button className="form-button" onClick={() => handleEdit(user)}>Редактировать</button>
                        <button className="delete-user-button" onClick={() => handleDelete(user.id)}>Удалить</button>
                      </div>
                    </>
                )}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default AdminPanel;
