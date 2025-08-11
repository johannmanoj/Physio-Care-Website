// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import LoginPage from "./components/auth/LoginPage";
// import HomePage from "./components/common/HomePage";

// export default function App() {
//   const { isLoggedIn, loading } = useAuth();
//   if (loading) return null;         

//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage />} />
//       <Route
//         path="/*"
//         element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
//       />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import HomePage from "./components/common/HomePage";

export default function App() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null;         

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/*"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
