type HeaderProps = {
    userName: string;
  };
  
  export function Header({ userName }: HeaderProps) {
    return (
      <header className="w-full p-4 bg-pink-400 text-white flex justify-between items-center shadow">
        <h1 className="font-bold">WanderPixie </h1>
        <span className="text-sm">Welcome back, {userName}! 👋</span>
      </header>
    );
  }
  
  export function Footer() {
    return (
      <footer className="w-full p-4 bg-gray-100 text-center text-sm text-gray-600 mt-6">
        © {new Date().getFullYear()} WanderPixie
      </footer>
    );
  }
  