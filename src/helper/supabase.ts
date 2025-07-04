import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const getEmojiUrlFromName = (filename: string) => {
  const base = "";
  return base + filename;
};

export const getBackgroundImageUrlFromName = (filename: string) => {
  const base = `${
    (process.env.SUPABASE_URL as string) || "http://localhost:8000"
  }/storage/v1/object/public/theme/BackgroundImage/`;
  return base + filename;
};

// return file name includes bucket name
export const urlToBucketFileName = (url: string) => {
  const fileStart = url.indexOf("public") + 7; // public = 6, / =1, hence 6+1 = 7
  return url.substring(fileStart);
};
