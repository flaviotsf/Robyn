export type PlatformLearnMore = {
  logoUrl: string;
  name: string;
  url: string;
};

export type PlatformLearnMoreProps = {
  platform: PlatformLearnMore;
};

export function PlatformLearnMore({ platform }: PlatformLearnMoreProps) {
  const { name, url, logoUrl } = platform;
  return (
    <a href={url} target="_blank">
      <div className="transition-colors relative rounded border shadow w-32 px-4 py-2 hover:bg-slate-50">
        <div className="flex flex-col text-center gap-1 align-middle justify-center">
          <div className="flex relative h-5 align-middle justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              style={{ maxHeight: 30, width: 'auto' }}
              alt={name}
            />
          </div>
          <span className="text-sm text-gray-800 mt-2">{name}</span>
        </div>
      </div>
    </a>
  );
}
