import { Outlet } from "react-router-dom";
import Header from "./Header";
import "../styles/PublicLayout.css";

function PublicLayout() {
  return (
    <>
      <Header />

      <main className="public-layout">
        <Outlet />
      </main>
    </>
  );
}

export default PublicLayout;