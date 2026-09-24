export interface LogestechsOriginConfig {
  companyId: string;
  senderName: string;
  senderPhone: string;
  cityId: number;
  villageId: number;
  warehouseName: string;
}

export const KAVEL_LOGESTECHS_ORIGIN: LogestechsOriginConfig = {
  companyId: process.env.LOGESTECHS_COMPANY_ID || "351",
  senderName: process.env.LOGESTECHS_SENDER_NAME || "كافيل بيرفيوم",
  senderPhone: process.env.LOGESTECHS_SENDER_PHONE || "0782347865",
  cityId: parseInt(process.env.LOGESTECHS_ORIGIN_CITY_ID || "1151", 10),
  villageId: parseInt(process.env.LOGESTECHS_ORIGIN_VILLAGE_ID || "6250", 10),
  warehouseName: "أبو نصير / عمان",
};

export interface CreatePackagePayload {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  destinationCityId: number;
  destinationVillageId?: number;
  destinationAddress: string;
  totalPriceJod: number;
  itemsDescription: string;
  notes?: string;
}

export interface LogestechsResult {
  success: boolean;
  trackingNumber?: string;
  packageId?: string;
  awbUrl?: string;
  error?: string;
}

export async function createLogestechsPackage(
  payload: CreatePackagePayload,
  origin: LogestechsOriginConfig = KAVEL_LOGESTECHS_ORIGIN
): Promise<LogestechsResult> {
  try {
    const endpoint = `https://api.logestechs.com/api/v1/companies/${origin.companyId}/packages`;

    const body = {
      reference_number: payload.orderNumber,
      sender_name: origin.senderName,
      sender_phone: origin.senderPhone,
      origin_city_id: origin.cityId,
      origin_village_id: origin.villageId,
      recipient_name: payload.recipientName,
      recipient_phone: payload.recipientPhone,
      destination_city_id: payload.destinationCityId,
      destination_village_id: payload.destinationVillageId,
      destination_address: payload.destinationAddress,
      cod_amount: payload.totalPriceJod,
      description: payload.itemsDescription,
      notes: payload.notes || "",
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `LogesTechs API Error (${res.status}): ${errText}`,
      };
    }

    const data = (await res.json()) as { tracking_number?: string; id?: string; barcode_url?: string };
    return {
      success: true,
      trackingNumber: data.tracking_number || `LT-${payload.orderNumber}`,
      packageId: data.id ? String(data.id) : undefined,
      awbUrl: data.barcode_url || `https://track.logestechs.com/${data.tracking_number}`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `LogesTechs Network Exception: ${msg}`,
    };
  }
}
