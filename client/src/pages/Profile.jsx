import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
        <img
          src={`${currentUser.avatar}`}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          name="username"
          className=" border-gray-500/50  p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
