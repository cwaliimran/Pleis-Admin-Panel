import React from 'react';

export default function SocialLinks({ organizationData }: any) {
  const facebook = organizationData?.basicInfo?.socialLinks?.facebook || '';
  const instagram = organizationData?.basicInfo?.socialLinks?.instagram || '';
  const youtube = organizationData?.basicInfo?.socialLinks?.youtube || '';
  const tiktok = organizationData?.basicInfo?.socialLinks?.tiktok || '';

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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
              <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
            </g>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m14 12l-3.5 2v-4z" />
              <path d="M2 12.708v-1.416c0-2.895 0-4.343.905-5.274c.906-.932 2.332-.972 5.183-1.053C9.438 4.927 10.818 4.9 12 4.9s2.561.027 3.912.065c2.851.081 4.277.121 5.182 1.053S22 8.398 22 11.292v1.415c0 2.896 0 4.343-.905 5.275c-.906.931-2.331.972-5.183 1.052c-1.35.039-2.73.066-3.912.066s-2.561-.027-3.912-.066c-2.851-.08-4.277-.12-5.183-1.052S2 15.602 2 12.708Z" />
            </g>
          </svg>
        </a>
      )}

      {/* TikTok */}
      {tiktok && (
        <a
          title="TikTok"
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 p-0 text-blue-800 transition-colors hover:bg-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M17.045 20.667C10.564 21.117 5 25.736 5 32.815C5 39.545 10.393 45 17.045 45s12.046-5.455 12.046-12.185l-.348-15.19c3.027 2.336 7.862 3.748 12.336 3.974c.8.04 1.568-.323 1.755-1.103c.095-.397.166-.914.166-1.573s-.07-1.176-.166-1.573c-.187-.78-.956-1.118-1.754-1.198c-6.05-.605-11.747-5.5-12.561-11.28c-.104-.73-.513-1.405-1.228-1.591A8.8 8.8 0 0 0 25.076 3a8.8 8.8 0 0 0-2.218.281c-.713.186-1.139.856-1.156 1.594l-.642 27.94c0 2.243-1.797 4.062-4.015 4.062s-4.015-1.819-4.015-4.062c0-2.332 1.95-3.833 4.015-4.217"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
