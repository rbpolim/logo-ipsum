import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="border-b shadow-sm">
      <div className="flex h-20 items-center px-4">
        <h1 className="font-black text-4xl">Supply Marine</h1>

        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
