import { useAuthStore } from "../stores/authStore";

export default function NavBar() {
  const { isLoggedIn, username, login, logout } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>KeyPass</div>
      <div>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span>Welcome, {username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => login("User")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
