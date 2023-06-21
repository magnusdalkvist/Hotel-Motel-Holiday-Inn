import { useRealtime } from "react-supabase";
import { useProfiles } from "../hooks/Profiles";
import { useEffect, useState } from "react";

export default function Users() {
  const { profiles, error, fetching } = useProfiles();
  const [sort, setSort] = useState("name");

  function sorting(a, b) {
    if (sort == "points") {
      return a.points > b.points ? -1 : 1;
    } else if (sort == "challenges") {
      return a.challenges.length > b.challenges.length ? -1 : 1;
    } else if (sort == "completed") {
      return a.completed > b.completed ? -1 : 1;
    }
    return a.first_name?.toLowerCase() < b.first_name?.toLowerCase() ? -1 : 1;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-x-16 pb-4">
        <h2 className="text-4xl">Løverne</h2>
        <select
          className="bg-[#333] p-2 rounded-lg cursor-pointer  "
          onChange={(e) => setSort(e.target.value)}
        >
          <option className="rounded-t-none" value="none" selected disabled hidden>
            Sorter efter
          </option>
          <option value="name">Navn</option>
          <option value="points">Point</option>
          <option value="challenges">Manglende</option>
          <option value="completed">Gennemførte</option>
        </select>
      </div>
      {!profiles && !error && <p>Indlæser...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-4 gap-x-4 gap-y-8">
          {profiles?.sort(sorting).map((user) => {
            const img = user.avatar ?? "avatar.webp";
            const challenges = user.challenges.length;
            const completed = user.completed ?? 0;

            return (
              <div
                key={user.id}
                className="bg-[#333] flex flex-col overflow-hidden rounded-xl drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
              >
                <div className="relative relative">
                  <img
                    src={img}
                    className="w-full aspect-square object-cover"
                    onError={({ currentTarget }) => (currentTarget.src = "avatar.webp")}
                  />
                  <p className="absolute text-sm top-2 right-2 px-4 py-2 bg-[rgba(0,0,0,0.75)] rounded-full">
                    {`${user.points} point`}
                  </p>
                  <h3 className="text-lg flex-1 bottom-0 px-4 py-2 left-0 right-0 absolute bg-[rgba(0,0,0,0.75)]">
                    {user.nickname
                      ? `
                        ${user.nickname} (${user.first_name} ${user.last_name})
                        `
                      : `
                        ${user.first_name} ${user.last_name}
                        `}
                  </h3>
                </div>

                <div className="bottom-0 gap-2  left-0 p-4 pt-2 right-0 flex flex-col h-full">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-bold">Udfordringer</h2>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#242424] rounded-xl h-full flex flex-col items-center justify-center p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="py-1 box-content opacity-50"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                        </svg>
                        <p className="text-xl">{challenges}</p>
                      </div>
                      <div className="bg-[#242424] rounded-xl h-full flex flex-col items-center justify-center p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="py-1 box-content opacity-50"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                        </svg>
                        <p className="text-xl">{completed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
