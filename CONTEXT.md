# Context: Kavel Perfume (كافيل بيرفيوم)

## Ubiquitous Language

### Brand & Product Concepts
- **Kavel Perfume (كافيل بيرفيوم)**: Jordanian luxury perfume house specializing in inspired premium fragrances with extreme longevity.
- **Inspired Fragrance (عطر مستوحى)**: An alternative formulation capturing the olfactory profile of a luxury/niche designer fragrance with high oil concentration (30%+).
- **Bottle Size (حجم الزجاجة)**: Strictly two formats: Standard (55ml) and Large (110ml).
- **Premium Increment / Surcharge (فارق الصنف الفاخر)**: Surcharge added to specific high-cost fragrance oils (e.g., Black Afgano, G*D of Fire, Imagination) both individually and within bundle offers.
- **Bundle Offer (باقة ترويجية)**: Curated package of 3, 4, or 5 perfumes offering bundled savings, free gift testers, and free shipping.

### Checkout & Logistics Concepts
- **Guest Checkout (الشراء الفوري السريع)**: Streamlined single-page checkout requiring exactly 4 fields: Full Name, WhatsApp Phone, Governorate/City, Detailed Address. No passwords, no login, no SMS OTP.
- **LogesTechs Dispatch (شحن لوجستكس)**: Autonomous courier delivery across all 12 Jordanian governorates, dispatched from origin warehouse in Amman - Abu Nseir (`cityId: 1151`, `villageId: 6250`).
- **WhatsApp Notification (إشعارات واتساب)**: Automated instant transactional messages sent via Evolution API (`wa.alphaperfume.net`, instance `kavel`) to both customer and admin.
- **Fragrance Sommelier AI (مستشار كافيل العطري)**: Real-time interactive AI chat assistant powered by Cloudflare Workers AI (`@cf/google/gemma-4-26b-a4b-it`) helping visitors select fragrances based on mood, season, occasion, and olfactory notes.

### Cloudflare Deployment & Infrastructure Mandates
- **Cloudflare Account ID**: Strictly `433fddd89cdffcfad449b39cbde6a798`. NEVER change or use any other account.
- **D1 Database**: `kavelfragrance-db` (`database_id: 49ae65f0-47ab-4f7f-900b-7c390eba8e28`).
- **R2 Storage**: `kavelperfume-media`.
- **Target Custom Domains**:
  - `test.kavelperfume.com`
  - `kavelperfume.com`
  - `www.kavelperfume.com`
  - `test.kavelfragrance.com`
  - `kavelfragrance.com`
- **Deployment Command**: Always deploy directly to this exact account and domain targets via `npm run deploy`.
