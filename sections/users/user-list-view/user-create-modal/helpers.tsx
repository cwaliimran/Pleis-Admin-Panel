export const formatDobDMY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};


export const splitPhoneByDial = (raw: string, code: string) => {
  // raw from react-phone-input-2 is digits without '+'
  const dial = (code || '').replace('+', '');
  if (!raw || !dial) return { code, number: raw || '' };
  const number = raw.startsWith(dial) ? raw.slice(dial.length) : raw;
  return { code, number };
};