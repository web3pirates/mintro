import { usePrivy } from "@privy-io/react-auth";

export default function LoginButton() {
  const { login } = usePrivy();

  return (
    <div>
      <button
        onClick={login}
        className="hover:cursor-pointer bg-[#6246ea] hover:bg-[#4f38c9] text-white font-bold text-md px-4 py-2 rounded-full transition-colors duration-200 shadow"
      >
        Log in
      </button>
    </div>
  );
}
