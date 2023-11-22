import '@/styles/globals.css';
import { Stepper } from './components/Stepper/Stepper';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-row px-8 mt-4 mb-4 w-full">
      <div className="flex flex-row rounded-[0.5rem] border bg-background shadow p-0 w-full">
        <div className="p-6 w-full">
          <Stepper />
          {children}
        </div>
      </div>
    </div>
  );
}
