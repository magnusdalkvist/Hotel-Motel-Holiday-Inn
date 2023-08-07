import { useState } from "react";
import { useDelete, useInsert, useRealtime, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import { useProfiles } from "../hooks/Profiles";
import clsx from "clsx";
import Loader from "../components/Loader";

export default function Auctions() {
  const { user } = useAuth();
  const { profiles } = useProfiles();
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [{ data: auctionsData, error, fetching }, reexecute] = useRealtime("auctions");
  const [{ fetching: fetchingInsert }, execute] = useInsert("auctions");

  const points = profiles?.find((data) => data.id == user?.id)?.points ?? 0;

  async function createAuction(event) {
    event.preventDefault();
    if (auctionsData?.find((auction) => auction.created_by == user?.id))
      return alert("Du har allerede en auktion");
    if (!user) return;
    const { count, data, error } = await execute({ name, price: price || 0, created_by: user?.id });
    if (!error) {
      setName("");
      setPrice("");
    }
  }

  return (
    <div className="max-w-[1250px] mx-auto flex flex-col gap-8 w-full">
      <div>
        <h1 className="mb-8 font-bold text-5xl md:text-7xl  drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
          Auktioner
        </h1>
        <form className="flex gap-4 flex-wrap items-end justify-center" onSubmit={createAuction}>
          <label htmlFor="name" className="flex flex-col flex-1 min-w-[100px]">
            Navn
            <input
              type="text"
              id="name"
              placeholder="Navn på auktionen"
              className="text-[rgba(255,255,255,0.87)]"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label htmlFor="price" className="flex flex-col">
            Pris
            <input
              className="w-[8ch] text-[rgba(255,255,255,0.87)]"
              pattern="\d*"
              maxLength="4"
              name="price"
              id="price"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <button className="bg-[#0ABE51] hover:bg-[#08913f] p-2 rounded-full max-w-[200px] w-full font-bold text-[#242424] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
            {fetchingInsert ? "Opretter..." : "Opret auktion"}
          </button>
        </form>
      </div>
      {fetching && <p>Indlæser...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {auctionsData?.map((auction) => (
            <Auction auction={auction} key={auction.id} />
          ))}
        </div>
      )}
    </div>
  );

  function Auction({ auction }) {
    const [{ fetching: fetchingDelete }, executeDelete] = useDelete("auctions");
    async function deleteAuction() {
      const { count, data, error } = await executeDelete((query) => query.eq("id", auction.id));
    }

    const [{ fetching: fetchingBuy }, execute] = useUpdate("profiles");
    async function buyAuction() {
      await execute({ points: points - auction.price }, (query) => query.eq("id", user?.id));
      await execute(
        {
          challenges: [
            ...profiles.find((profile) => profile.id == auction.created_by).challenges,
            { type: "auction", ...auction, from: user?.id },
          ],
        },
        (query) => query.eq("id", auction.created_by)
      );
      const { count, data, error } = await executeDelete((query) => query.eq("id", auction.id));
    }

    return (
      <div
        key={auction.id}
        className={clsx(
          "bg-[#333] p-4 rounded-xl flex flex-col gap-4 drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]",
          points < auction.price && user?.id != auction.created_by && "opacity-50"
        )}
      >
        <h3 className="text-xl flex-1">{auction.name}</h3>
        <div>
          <p>Pris: {auction.price} point</p>
          <p>
            Oprettet af: {profiles?.find((profile) => profile.id == auction.created_by)?.first_name}{" "}
            {profiles?.find((profile) => profile.id == auction.created_by)?.last_name}
          </p>
        </div>
        {auction.created_by == user?.id ? (
          <button
            onClick={deleteAuction}
            className="bg-[#242424] px-4 py-2 rounded-lg flex font-bold justify-center w-full hover:bg-[#0ABE51] active:bg-[#08913f] hover:text-[#242424] transition duration-300 disabled:bg-[#242424] disabled:text-[rgba(255,255,255,0.87)] disabled:cursor-not-allowed"
          >
            {fetchingDelete ? <Loader /> : "Delete"}
          </button>
        ) : (
          <button
            onClick={buyAuction}
            disabled={points < auction.price}
            className="bg-[#242424] px-4 py-2 rounded-lg flex font-bold justify-center w-full hover:bg-[#0ABE51] active:bg-[#08913f] hover:text-[#242424] transition duration-300 disabled:bg-[#242424] disabled:text-[rgba(255,255,255,0.87)] disabled:cursor-not-allowed"
          >
            {fetchingBuy ? <Loader /> : "Buy"}
          </button>
        )}
      </div>
    );
  }
}
