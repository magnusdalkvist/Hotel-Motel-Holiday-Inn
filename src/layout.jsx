import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useRealtime } from "react-supabase";

export default function Layout() {
  return (
    <>
      <Nav />
      <main className="max-w-[1250px] mx-auto w-full p-4 pb-8">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
