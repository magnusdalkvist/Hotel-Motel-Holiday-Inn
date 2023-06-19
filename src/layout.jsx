import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useRealtime } from "react-supabase";

export default function Layout() {
  const [{ data: profiles }] = useRealtime("profiles");

  return (
    <>
      <Nav profiles={profiles} />
      <main className="flex-1">
        <Outlet profiles={profiles} />
      </main>
      {/* <Footer /> */}
    </>
  );
}
