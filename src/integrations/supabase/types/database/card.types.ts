import { Database } from "./base.types";

export type Bank = Database["public"]["Tables"]["banks"]["Row"];
export type CardBenefit = Database["public"]["Tables"]["card_benefits"]["Row"];
export type CardRequest = Database["public"]["Tables"]["card_requests"]["Row"];
export type CashbackRate = Database["public"]["Tables"]["cashback_rates"]["Row"];
export type Webpage = Database["public"]["Tables"]["webpages"]["Row"];

type Tables = Database["public"]["Tables"];

// Tipo base para tarjetas de crédito
type BaseCreditCard = Tables["credit_cards"]["Row"];

// Tipo para la respuesta de Supabase
export type SupabaseCreditCardResponse = {
    bank: Pick<Tables["banks"]["Row"], "name"> | null;
    webpage: Pick<Tables["webpages"]["Row"], "id" | "meta_title" | "slug_url"> | null;
    cashback_rates: CashbackRate[] | null;
    card_benefits: CardBenefit[] | null;
} & Omit<BaseCreditCard, "webpage_id">;

// Tipo para el componente
export type CreditCard = Omit<BaseCreditCard, "webpage_id"> & {
    bank?: Pick<Tables["banks"]["Row"], "name"> | null;
    webpage?: Pick<Tables["webpages"]["Row"], "id" | "meta_title" | "slug_url"> | null;
    cashback_rates?: CashbackRate[];
    card_benefits?: CardBenefit[];
};

// Insert Types
export type BankInsert = Database["public"]["Tables"]["banks"]["Insert"];
export type CardBenefitInsert = Database["public"]["Tables"]["card_benefits"]["Insert"];
export type CardRequestInsert = Database["public"]["Tables"]["card_requests"]["Insert"];
export type CashbackRateInsert = Database["public"]["Tables"]["cashback_rates"]["Insert"];
export type CreditCardInsert = Database["public"]["Tables"]["credit_cards"]["Insert"];

// Update Types
export type BankUpdate = Database["public"]["Tables"]["banks"]["Update"];
export type CardBenefitUpdate = Database["public"]["Tables"]["card_benefits"]["Update"];
export type CardRequestUpdate = Database["public"]["Tables"]["card_requests"]["Update"];
export type CashbackRateUpdate = Database["public"]["Tables"]["cashback_rates"]["Update"];
export type CreditCardUpdate = Database["public"]["Tables"]["credit_cards"]["Update"];