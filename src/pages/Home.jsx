import Users from "../components/Users";

export default function Home() {
  return (
    <div className="max-w-[1250px] mx-auto  w-full">
      <h1 className="mb-8 font-bold text-5xl md:text-7xl  drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
        Hotel Motel Holiday Inn
      </h1>
      <Users />
    </div>
  );
}
