import { Database } from "./database";

type PublicSchema = Database[Extract<keyof Database, "public">];

export type CreditCard = PublicSchema["Tables"]["credit_cards"]["Row"];
export type CreditCardInsert = PublicSchema["Tables"]["credit_cards"]["Insert"];
export type CreditCardUpdate = PublicSchema["Tables"]["credit_cards"]["Update"];

export type CardBenefit = PublicSchema["Tables"]["card_benefits"]["Row"];
export type CashbackRate = PublicSchema["Tables"]["cashback_rates"]["Row"];
export type CardRequest = PublicSchema["Tables"]["card_requests"]["Row"];
export type Bank = PublicSchema["Tables"]["banks"]["Row"];