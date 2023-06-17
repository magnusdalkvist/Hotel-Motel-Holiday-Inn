import { useState } from "react";
import { useDelete, useInsert, useRealtime, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import { useProfiles } from "../hooks/Profiles";
import clsx from "clsx";

export default function Auction() {
  const { user } = useAuth();
  const { profiles } = useProfiles();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [{ data, error, fetching }, reexecute] = useRealtime("auctions");
  const [{}, execute] = useInsert("auctions");

  const points = profiles?.find((data) => data.id == user?.id)?.points ?? 0;

  async function createAuction(event) {
    event.preventDefault();
    console.log("createAuction");
    const { count, data, error } = await execute({ name, price, created_by: user.id });
    if (!error) {
      setName("");
      setPrice(0);
    }
  }

  return (
    <div>
      <h1>Auction</h1>
      <form className="flex flex-col items-start max-w-[300px]" onSubmit={createAuction}>
        <label htmlFor="name">Name</label>
        <input
          className="w-full"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label htmlFor="price">Price</label>
        <input
          className="w-full"
          type="range"
          step="10"
          min="0"
          max={3000}
          defaultValue={0}
          value={price}
          name="price"
          onChange={(e) => setPrice(e.target.value)}
        />
        {price}
        {}
        <input type="submit" value="Create auction" />
      </form>
      <div className="grid md:grid-cols-3 gap-4">
        {data?.map((auction) => (
          <Auction auction={auction} key={auction.id} />
        ))}
      </div>
    </div>
  );

  function Auction({ auction }) {
    const [{ fetching }, executeDelete] = useDelete("auctions");
    async function deleteAuction() {
      const { count, data, error } = await executeDelete((query) => query.eq("id", auction.id));
    }

    const [{}, execute] = useUpdate("profiles");
    async function buyAuction() {
      await execute({ points: points - auction.price }, (query) => query.eq("id", user?.id));
      await execute(
        {
          perks: [
            ...profiles.find((profile) => profile.id == auction.created_by).perks,
            { type: "auction", ...auction },
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
          "bg-[#333] rounded-xl p-4",
          points < auction.price && user?.id != auction.created_by && "opacity-50"
        )}
      >
        <p>{auction.name}</p>
        <p>{auction.price}</p>
        <p>{profiles?.find((profile) => profile.id == auction.created_by)?.nickname}</p>
        {auction.created_by == user?.id ? (
          <button onClick={deleteAuction}>Delete</button>
        ) : (
          <button onClick={buyAuction} disabled={points < auction.price}>
            Buy
          </button>
        )}
      </div>
    );
  }
}
