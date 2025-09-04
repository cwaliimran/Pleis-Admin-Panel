import React from 'react';

export default function SocialLinks({ organizationData }: any) {
  const facebook = organizationData?.basicInfo?.socialLinks?.facebook || '';
  const instagram = organizationData?.basicInfo?.socialLinks?.instagram || '';
  const linkedin = organizationData?.basicInfo?.socialLinks?.linkedin || '';
  const youtube = organizationData?.basicInfo?.socialLinks?.youtube || '';

  return (
    <div className="mb-3 flex gap-2">
      {/* Facebook */}
      {facebook && (
        <a
          title="Facebook"
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            />
          </svg>
        </a>
      )}

      {/* Instagram */}
      {instagram && (
        <a
          title="Instagram"
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
              <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
            </g>
          </svg>
        </a>
      )}

      {/* LinkedIn */}
      {linkedin && (
        <a
          href={linkedin}
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M5 1.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M3.75 4a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m-1.5 4A.75.75 0 0 1 3 7.25h4a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V8.75zM9.25 8a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v.434l.435-.187a7.8 7.8 0 0 1 2.358-.595C20.318 7.4 22.75 9.58 22.75 12.38V21a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75v-7a1.25 1.25 0 0 0-2.5 0v7a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V14a2.75 2.75 0 1 1 5.5 0v6.25h2.5v-7.87c0-1.904-1.661-3.408-3.57-3.234a6.3 6.3 0 0 0-1.904.48l-1.48.635a.75.75 0 0 1-1.046-.69V8.75z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}

      {/* YouTube */}
      {youtube && (
        <a
          title="YouTube"
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14 12l-3.5 2v-4z"
              />
              <path d="M2 12.708v-1.416c0-2.895 0-4.343.905-5.274c.906-.932 2.332-.972 5.183-1.053C9.438 4.927 10.818 4.9 12 4.9s2.561.027 3.912.065c2.851.081 4.277.121 5.182 1.053S22 8.398 22 11.292v1.415c0 2.896 0 4.343-.905 5.275c-.906.931-2.331.972-5.183 1.052c-1.35.039-2.73.066-3.912.066s-2.561-.027-3.912-.066c-2.851-.08-4.277-.12-5.183-1.052S2 15.602 2 12.708Z" />
            </g>
          </svg>
        </a>
      )}
    </div>
  );
}
