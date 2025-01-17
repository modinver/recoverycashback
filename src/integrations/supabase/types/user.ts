import { Database } from "./database";

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Profile = PublicSchema["Tables"]["profiles"]["Row"];
export type ProfileInsert = PublicSchema["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = PublicSchema["Tables"]["profiles"]["Update"];