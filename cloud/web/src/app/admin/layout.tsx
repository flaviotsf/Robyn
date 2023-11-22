import '@/styles/globals.css';
import Image from 'next/image';
import { Sidebar } from './components/Sidebar/Sidebar';
import { UserNav } from './components/UserNav/UserNav';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="bg-zinc-50 h-screen overflow-hidden relative">
      <div className="rounded-[0.5rem] border bg-background sticky w-full z-40 h-16">
        <div className="flex flex-row items-center">
          <div className="flex flex-row gap-4 items-center ml-1 mx-auto my-2">
            <Image src="/logo.png" alt="logo" width={48} height={48} />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">Robyn Cloud</span>
              <span className="text-sm text-gray-800">
                Your private, open-source, AI assistant for media planning
              </span>
            </div>
          </div>
          <div className="text-right mr-3">
            <UserNav />
          </div>
        </div>
      </div>

      <Sidebar />
      <ScrollArea className="w-full px-4 sm:px-6 md:px-8 lg:ps-72 h-full mb-6">
        <div className="py-4 m">{children}</div>
      </ScrollArea>
    </div>
  );
}
