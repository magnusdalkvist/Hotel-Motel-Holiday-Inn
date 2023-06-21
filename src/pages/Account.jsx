import { useClient, useSelect, useSignOut, useUpdate } from "react-supabase";
import { useAuth } from "../hooks/Auth";
import { useEffect, useState } from "react";
import { useProfiles } from "../hooks/Profiles";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Account() {
  const client = useClient();
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { profiles } = useProfiles();
  const [nickname, setNickname] = useState("");
  const [{ error }, signOut] = useSignOut();
  const [{ fetching }, execute] = useUpdate("profiles");
  const [{ data: challenges }] = useSelect("challenges");
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [open, setOpen] = useState(false);

  const firstName = profiles?.find((profile) => profile.id == user?.id)?.first_name;
  const lastName = profiles?.find((profile) => profile.id == user?.id)?.last_name;
  const currentNickname = profiles?.find((profile) => profile.id == user?.id)?.nickname;

  async function onClickSignOut() {
    const { error } = await signOut();
  }

  async function removeAvatar() {
    await execute({ avatar: "" }, (query) => query.eq("id", user.id));
  }

  async function updateUser(e) {
    e.preventDefault();
    const { count, data, error } = await execute({ nickname, avatar: avatarURL }, (query) =>
      query.eq("id", user.id)
    );
  }

  useEffect(() => {
    if (profiles) {
      setNickname(profiles?.find((profile) => profile.id == user?.id)?.nickname);
      setAvatar(profiles?.find((profile) => profile.id == user?.id)?.avatar);
    }
  }, [profiles]);

  if (session)
    return (
      <div className="flex flex-col gap-8 pt-16 items-center">
        <div className="w-full flex flex-col gap-4 items-center">
          <div
            className="account-avatar aspect-square min-w-[100px] w-1/3 md:w-1/5 rounded-full overflow-hidden drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)] "
            onClick={removeAvatar}
          >
            <img src={avatar || "avatar.webp"} className="w-full h-full object-cover bg-[#333]" />
          </div>
          <h1 className="font-bold text-5xl md:text-7xl  drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
            Hej {currentNickname || firstName},
          </h1>
        </div>
        <div className="w-full">
          <div
            className="flex gap-4 justify-center items-center w-full select-none cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <h2 className="text-2xl">Rediger info</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={clsx(
                "w-6 h-6 cursor-pointer transition duration-300",
                open && "rotate-180"
              )}
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </div>
          <form
            className={clsx(
              "flex flex-col transition-all duration-300 items-center gap-4",
              !open && "hidden"
            )}
            onSubmit={updateUser}
          >
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="firstName" className="flex flex-col opacity-50 cursor-default">
                Fornavn
                <input type="text" name="firstName" id="firstName" value={firstName} disabled />
              </label>
              <label htmlFor="lastName" className="flex flex-col opacity-50 cursor-default">
                Efternavn
                <input type="text" name="lastName" id="lastName" value={lastName} disabled />
              </label>
              <label htmlFor="nickname" className="flex flex-col">
                Kælenavn
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  className=" "
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
              <label htmlFor="avatar" className="flex flex-col">
                Profilbillede URL
                <input
                  type="text"
                  name="avatar"
                  id="avatar"
                  className=""
                  value={avatarURL}
                  onChange={(e) => setAvatarURL(e.target.value)}
                />
              </label>
            </div>
            <button className="flex justify-center bg-[#0ABE51] hover:bg-[#08913f] p-3 rounded-full max-w-[200px] w-full font-bold text-[#242424] drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]">
              {fetching ? <Loader /> : "Opdater info"}
            </button>
          </form>
        </div>
        {profiles?.find((profile) => profile.id == user?.id).challenges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profiles
              ?.find((profile) => profile.id == user?.id)
              .challenges?.map((challenge, i) => (
                <Challenge challenge={challenge} key={i} />
              ))}
          </div>
        )}
        <button
          onClick={onClickSignOut}
          className="bg-[#333] p-3 rounded-full max-w-[200px] w-full font-bold drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
        >
          Log ud
        </button>
      </div>
    );
  else navigate("/signin");

  function Challenge({ challenge }) {
    const [{ fetching }, execute] = useUpdate("profiles");
    async function redeemChallenge() {
      const profile = profiles?.find((profile) => profile.id === user?.id);
      const index =
        challenge.type == "challenge"
          ? profile?.challenges.findIndex((p) => p.id === challenge.id && p.type == "challenge")
          : profile?.challenges.findIndex((p) => p.id === challenge.id && p.type == "auction");

      if (index !== -1) {
        const updatedChallenges = [
          ...profile.challenges.slice(0, index),
          ...profile.challenges.slice(index + 1),
        ];

        await execute(
          {
            challenges: updatedChallenges,
            completed: profile.completed + 1,
            points:
              challenge.type == "challenge"
                ? profiles?.find((profile) => profile.id == user?.id)?.points + challenge.price / 2
                : profiles?.find((profile) => profile.id == user?.id)?.points + challenge.price,
          },
          (query) => query.eq("id", user?.id)
        );
      }
    }

    return (
      <div
        key={challenge.id}
        className="flex flex-col gap-2 bg-[#555] p-4 rounded-xl drop-shadow-[0_.5rem_5px_rgba(0,0,0,0.25)]"
      >
        <div className="flex justify-between text-xs gap-4 flex-wrap">
          <p className="capitalize">{challenge.type}</p>
          {challenge.type == "challenge" ? (
            <p>{challenge.price / 2} point</p>
          ) : (
            <p>{challenge.price} point</p>
          )}
        </div>
        <h3 className="text-xl">{challenge.name}</h3>
        <p>
          from {profiles.find((profile) => profile.id === challenge.from).first_name}{" "}
          {profiles.find((profile) => profile.id === challenge.from).last_name}
        </p>
        <button
          onClick={redeemChallenge}
          className="bg-[#333] px-4 py-2 rounded-lg flex font-bold justify-center w-full hover:bg-[#0ABE51] active:bg-[#08913f] hover:text-[#242424] transition duration-300"
        >
          {fetching ? <Loader /> : "Claim"}
        </button>
      </div>
    );
  }
}
