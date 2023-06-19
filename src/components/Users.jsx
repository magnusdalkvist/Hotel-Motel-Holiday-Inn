import { useRealtime } from "react-supabase";
import { useProfiles } from "../hooks/Profiles";

export default function Users() {
  const { profiles, error, fetching } = useProfiles();

  return (
    <div>
      <h2 className="text-2xl">Users</h2>
      {!profiles && !error && <p>Loading...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-fr gap-4">
          {profiles
            ?.sort((a, b) => b.first_name < a.first_name)
            .map((user) => {
              const img = `https://fxrkypplzrbtfuemvgzn.supabase.co/storage/v1/object/public/avatars/${
                user.id
              }/avatar?cache=${Date.now()}`;
              return (
                <div
                  key={user.id}
                  className="bg-[#555] aspect-square relative overflow-hidden rounded-xl "
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover"
                    onError={({ currentTarget }) => (currentTarget.src = "avatar.webp")}
                  />
                  <div className="bottom-0 left-0 px-4 py-2 right-0 absolute bg-[rgba(50,50,50,0.5)]">
                    {user.nickname ? (
                      <p>
                        {user.nickname} ({user.first_name} {user.last_name})
                      </p>
                    ) : (
                      <p>
                        {user.first_name} {user.last_name}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
