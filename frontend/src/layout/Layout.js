import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 260px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
