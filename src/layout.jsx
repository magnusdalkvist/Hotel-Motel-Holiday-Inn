import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useRealtime } from "react-supabase";

export default function Layout() {
  return (
    <>
      <Nav />
      <main className="p-4 pb-8">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
