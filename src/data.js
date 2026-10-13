const asset = (name) => `${import.meta.env.BASE_URL}products/${name}`;

export const categories = ["All products", "Packaging", "Food & beverage", "Kitchen & home", "Textiles", "Household", "Office"];

export const products = [
  { id: "sku-401", name: "Recycled kraft mailer", detail: "Self-seal, 12 x 16 in", category: "Packaging", supplierId: "sup-paper", supplier: "Paper Lane Co.", price: 0.24, unit: "per unit", moq: 5000, lead: "8-12 days", rating: 4.9, image: asset("mailer.svg"), color: "sand", tag: "Low minimum" },
  { id: "sku-214", name: "Cold brew glass bottle", detail: "Amber glass, 500 ml", category: "Kitchen & home", supplierId: "sup-glass", supplier: "North Harbor Glass", price: 0.78, unit: "per bottle", moq: 2500, lead: "14-18 days", rating: 4.8, image: asset("bottle.svg"), color: "blue", tag: "Best seller" },
  { id: "sku-096", name: "Single-origin arabica", detail: "Medium roast, 60 kg bag", category: "Food & beverage", supplierId: "sup-ridge", supplier: "Ridge Roasters", price: 8.4, unit: "per kg", moq: 60, lead: "5-7 days", rating: 4.9, image: asset("coffee.svg"), color: "roast", tag: "Ready to ship" },
  { id: "sku-532", name: "Organic cotton market tote", detail: "12 oz canvas, natural", category: "Textiles", supplierId: "sup-thread", supplier: "Threadwell Studio", price: 1.9, unit: "per bag", moq: 1000, lead: "16-21 days", rating: 4.7, image: asset("tote.svg"), color: "rose", tag: "Custom print" },
  { id: "sku-187", name: "Plant-based surface wash", detail: "Concentrate, 1 L refill", category: "Household", supplierId: "sup-clear", supplier: "ClearField Labs", price: 2.1, unit: "per bottle", moq: 800, lead: "7-10 days", rating: 4.8, image: asset("cleaner.svg"), color: "mint", tag: "Verified source" },
  { id: "sku-329", name: "Recycled lay-flat journal", detail: "Dot grid, 160 pages", category: "Office", supplierId: "sup-paper", supplier: "Paper Lane Co.", price: 1.05, unit: "per book", moq: 2000, lead: "10-14 days", rating: 4.6, image: asset("journal.svg"), color: "lilac", tag: "Popular" },
  { id: "sku-448", name: "Corrugated shipper box", detail: "32 ECT, 14 x 10 x 8 in", category: "Packaging", supplierId: "sup-box", supplier: "Boxline Works", price: 1.2, unit: "per carton", moq: 1200, lead: "9-13 days", rating: 4.8, image: asset("mailer.svg"), color: "blue", tag: "Recycled fiber" },
  { id: "sku-276", name: "Bamboo waffle hand towel", detail: "450 GSM, set of 2", category: "Textiles", supplierId: "sup-thread", supplier: "Threadwell Studio", price: 5.2, unit: "per set", moq: 600, lead: "12-16 days", rating: 4.7, image: asset("tote.svg"), color: "mint", tag: "Soft touch" },
  { id: "sku-615", name: "Borosilicate pantry jar", detail: "Airtight lid, 750 ml", category: "Kitchen & home", supplierId: "sup-glass", supplier: "North Harbor Glass", price: 1.35, unit: "per jar", moq: 1800, lead: "14-18 days", rating: 4.9, image: asset("bottle.svg"), color: "lilac", tag: "New arrival" },
];

export const suppliers = [
  { id: "sup-paper", name: "Paper Lane Co.", location: "Portland, OR", specialty: "Recycled paper goods", verified: true, rating: 4.9, response: "Usually replies in 2 hours", onTime: "98% on-time delivery", years: 12, products: 18, initials: "PL", color: "violet" },
  { id: "sup-glass", name: "North Harbor Glass", location: "Tacoma, WA", specialty: "Reusable glass packaging", verified: true, rating: 4.8, response: "Usually replies in 4 hours", onTime: "96% on-time delivery", years: 21, products: 24, initials: "NH", color: "blue" },
  { id: "sup-ridge", name: "Ridge Roasters", location: "Bend, OR", specialty: "Specialty coffee & tea", verified: true, rating: 4.9, response: "Usually replies in 1 hour", onTime: "99% on-time delivery", years: 9, products: 11, initials: "RR", color: "orange" },
  { id: "sup-thread", name: "Threadwell Studio", location: "Los Angeles, CA", specialty: "Responsible textiles", verified: true, rating: 4.7, response: "Usually replies in 1 business day", onTime: "95% on-time delivery", years: 16, products: 32, initials: "TS", color: "rose" },
  { id: "sup-clear", name: "ClearField Labs", location: "Madison, WI", specialty: "Plant-based home care", verified: true, rating: 4.8, response: "Usually replies in 3 hours", onTime: "97% on-time delivery", years: 11, products: 15, initials: "CF", color: "mint" },
  { id: "sup-box", name: "Boxline Works", location: "Columbus, OH", specialty: "Corrugated shipping supplies", verified: true, rating: 4.8, response: "Usually replies in 5 hours", onTime: "96% on-time delivery", years: 18, products: 27, initials: "BW", color: "yellow" },
];

export const initialRfqs = [
  { id: "RFQ-2084", title: "Holiday gift set packaging", buyer: "Morgan Ellis", supplierId: "sup-paper", supplier: "Paper Lane Co.", products: [{ productId: "sku-401", name: "Recycled kraft mailer", quantity: 8000, unit: "units" }], budget: 4800, created: "Oct 12, 2026", due: "Oct 24, 2026", status: "Awaiting quote", note: "Please include two-color logo printing." },
  { id: "RFQ-2079", title: "Cafe opening essentials", buyer: "Morgan Ellis", supplierId: "sup-ridge", supplier: "Ridge Roasters", products: [{ productId: "sku-096", name: "Single-origin arabica", quantity: 120, unit: "kg" }], budget: 1800, created: "Oct 10, 2026", due: "Oct 18, 2026", status: "Under review", note: "Quote both 60 kg and 120 kg volume tiers." },
  { id: "RFQ-2068", title: "Refill station launch", buyer: "Morgan Ellis", supplierId: "sup-clear", supplier: "ClearField Labs", products: [{ productId: "sku-187", name: "Plant-based surface wash", quantity: 1200, unit: "bottles" }], budget: 3200, created: "Oct 7, 2026", due: "Oct 20, 2026", status: "Approved", note: "Confirm recyclable cap availability." },
];

export const initialOrders = [
  { id: "PO-48120", supplierId: "sup-paper", supplier: "Paper Lane Co.", title: "Autumn mailer restock", items: 3, total: 6840, placed: "Oct 11, 2026", eta: "Oct 22, 2026", status: "Processing" },
  { id: "PO-48114", supplierId: "sup-ridge", supplier: "Ridge Roasters", title: "Cafe opening essentials", items: 2, total: 1680, placed: "Oct 9, 2026", eta: "Oct 17, 2026", status: "Ready to ship" },
  { id: "PO-48098", supplierId: "sup-thread", supplier: "Threadwell Studio", title: "Cotton tote sample run", items: 1, total: 2150, placed: "Oct 6, 2026", eta: "Oct 21, 2026", status: "In transit" },
  { id: "PO-48071", supplierId: "sup-glass", supplier: "North Harbor Glass", title: "Amber bottle replenishment", items: 2, total: 4320, placed: "Oct 2, 2026", eta: "Oct 12, 2026", status: "Delivered" },
];

export const formatMoney = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
export const formatQuantity = (amount, unit) => {
  const label = unit.replace("per ", "");
  const plural = label === "kg" || label.endsWith("s") ? label : label + "s";
  return amount.toLocaleString() + " " + plural;
};
