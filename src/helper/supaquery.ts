import { supabase } from "./supabase";

export const getUserWithFriends = async (email: string) => {
  const user = await supabase.from("User").select();
};
export const getFriend = async (email: string) => {
  const user = await supabase.rpc("query_friend", { email });
  return user;
};
export const addFriend = async (email1: string, email2: string) => {
  try {
    //take id from email
    const { data: data1 } = await supabase
      .from("User")
      .select("id")
      .eq("email", email1);
    const { data: data2 } = await supabase
      .from("User")
      .select("id")
      .eq("email", email2);

    if (data1 == null || data2 == null) throw new Error("User not found");
    if (data1.length == 0 || data2.length == 0)
      throw new Error("User not found");

    // insert into Friend
    const id1 = data1[0].id;
    const id2 = data2[0].id;
    await supabase.from("Friend").insert({ user1_id: id1, user2_id: id2 });
    // duplicate (a,b) (b,a) is okay, since query handles that
  } catch (err) {
    throw err;
  }
};
