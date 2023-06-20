import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useRealtime } from "react-supabase";

export default function Layout() {
  return (
    <>
      <Nav />
      <main className="flex-1 max-w-[1250px] mx-auto box-content p-4 pb-8">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
