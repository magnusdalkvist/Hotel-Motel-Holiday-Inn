import { useRealtime } from "react-supabase";
import { useProfiles } from "../hooks/Profiles";

export default function Users() {
  const { profiles, error, fetching } = useProfiles();
  return (
    <div>
      <h2 className="text-2xl">Users</h2>
      {fetching && <p>Loading...</p>}
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {profiles?.map((user) => (
            <div key={user.id} className="bg-[#555] p-4 rounded-xl ">
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
          ))}
        </div>
      )}
    </div>
  );
}
