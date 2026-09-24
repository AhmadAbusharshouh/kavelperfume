"use client";

import { useState, useEffect } from "react";
import { Lock, RefreshCw, Truck, CheckCircle2, Clock, DollarSign, Package, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  title: string;
  size: string;
  quantity: number;
  totalPrice: number;
  selections?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  governorate: string;
  cityName?: string;
  addressDetails: string;
  notes?: string;
  totalAmount: number;
  status: "pending" | "approved" | "dispatched" | "delivered" | "cancelled";
  logestechsTrackingNumber?: string;
  logestechsAwbUrl?: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "pricing">("orders");

  // Dynamic Pricing State
  const [base55, setBase55] = useState(11);
  const [base110, setBase110] = useState(16);
  const [shipping, setShipping] = useState(2);
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadOrders();
        loadPricing();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadOrders();
        loadPricing();
        toast.success("تم تسجيل الدخول بنجاح");
      } else {
        toast.error("رمز PIN غير صحيح");
      }
    } catch {
      toast.error("فشل التحقق من الرمز");
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadPricing = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.pricing) {
        setBase55(data.pricing.base55 || 11);
        setBase110(data.pricing.base110 || 16);
        setShipping(data.pricing.shipping || 2);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPricing(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "pricing",
          value: { base55, base110, shipping },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("تم تحديث الأسعار في قاعدة البيانات فورياً بنجاح");
      } else {
        toast.error(data.error || "فشل تحديث الأسعار");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setIsSavingPricing(false);
    }
  };

  const handleDispatch = async (orderId: string) => {
    setDispatchingId(orderId);
    try {
      const res = await fetch("/api/admin/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`تم إنشاء بوليصة لوجستكس #${data.trackingNumber} وإرسال إشعار للعميل!`);
        loadOrders();
      } else {
        toast.error(data.error || "فشل الشحن");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setDispatchingId(null);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">جاري التحقق من الجلسة...</div>;
  }

  // PIN Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <form onSubmit={handleLogin} className="luxury-card p-8 bg-white border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#fdfbf7] border border-[#ba997a]/40 text-[#3f2911] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#ba997a]" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-[#3f2911]">لوحة تحكم كافيل بيرفيوم</h1>
            <p className="text-xs text-slate-500 mt-1">أدخل رمز PIN السري للإدارة للدخول</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="رمز PIN (مثال: kavel2026)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-bold tracking-widest outline-none focus:bg-white focus:border-[#ba997a]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            دخول لوحة التحكم
          </button>
        </form>
      </div>
    );
  }

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const dispatchedCount = orders.filter((o) => o.status === "dispatched").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
            لوحة إدارة الطلبات والأسعار (Kavel Admin)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            مستودع الشحن: أبو نصير / عمان (LogesTechs Company ID: 351)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadOrders}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="luxury-card p-5 bg-white border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-[#ba997a]" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">إجمالي الطلبات</span>
            <span className="text-2xl font-extrabold text-[#3f2911]">{orders.length}</span>
          </div>
        </div>

        <div className="luxury-card p-5 bg-white border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">إجمالي المبيعات</span>
            <span className="text-2xl font-extrabold text-emerald-700">{totalRevenue} د.أ</span>
          </div>
        </div>

        <div className="luxury-card p-5 bg-white border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">بانتظار الشحن</span>
            <span className="text-2xl font-extrabold text-amber-700">{pendingCount}</span>
          </div>
        </div>

        <div className="luxury-card p-5 bg-white border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">خرجت للتوصيل</span>
            <span className="text-2xl font-extrabold text-blue-700">{dispatchedCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "orders"
              ? "bg-[#3f2911] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          قائمة الطلبات والشحن ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "pricing"
              ? "bg-[#3f2911] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          تعديل الأسعار والعروض (Dynamic Pricing)
        </button>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === "orders" && (
        <div className="luxury-card overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-3.5 font-bold">رقم الطلب</th>
                  <th className="p-3.5 font-bold">العميل والهاتف</th>
                  <th className="p-3.5 font-bold">المحافظة والعنوان</th>
                  <th className="p-3.5 font-bold">المنتجات المطلوبة</th>
                  <th className="p-3.5 font-bold text-center">المبلغ الإجمالي</th>
                  <th className="p-3.5 font-bold text-center">الحالة</th>
                  <th className="p-3.5 font-bold text-center">إجراءات الشحن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      #{ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString("ar-JO")}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <strong className="text-slate-900 block">{ord.fullName}</strong>
                      <a
                        href={`https://wa.me/${ord.phone.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-emerald-700 hover:underline"
                        dir="ltr"
                      >
                        {ord.phone}
                      </a>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <span className="font-bold text-slate-800 block">
                        {ord.governorate} / {ord.cityName || ""}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-2">
                        {ord.addressDetails}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs space-y-1">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it, i) => (
                          <div key={i} className="text-[11px] text-slate-700">
                            • <strong>{it.title}</strong> ({it.size}) × {it.quantity}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400">تفاصيل عامة</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center font-extrabold text-sm text-[#3f2911]">
                      {ord.totalAmount} د.أ
                    </td>

                    <td className="p-3.5 text-center">
                      {ord.status === "dispatched" ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200 inline-flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          خرج للتوصيل
                        </span>
                      ) : ord.status === "delivered" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          تم التسليم
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          قيد المراجعة
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      {ord.logestechsTrackingNumber ? (
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold block">
                            {ord.logestechsTrackingNumber}
                          </span>
                          {ord.logestechsAwbUrl && (
                            <a
                              href={ord.logestechsAwbUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              <span>البوليصة</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDispatch(ord.id)}
                          disabled={dispatchingId === ord.id}
                          className="px-3 py-1.5 rounded-lg bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-[11px] font-bold transition shadow-xs inline-flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3 text-[#ba997a]" />
                          <span>{dispatchingId === ord.id ? "جاري الشحن..." : "شحن لوجستكس"}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC PRICING EDITOR */}
      {activeTab === "pricing" && (
        <form
          onSubmit={handleSavePricing}
          className="luxury-card p-6 sm:p-8 bg-white border border-slate-200 max-w-2xl mx-auto space-y-6 shadow-sm"
        >
          <div>
            <h2 className="text-base font-extrabold text-[#3f2911]">
              تعديل أسعار المتجر ورسوم التوصيل (قاعدة بيانات D1)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تطبيق فوري في الموقع بدون إعادة رفع كود (Zero-redeploy).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سعر العطر العادي (55 مل)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={base55}
                  onChange={(e) => setBase55(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-left"
                  dir="ltr"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">د.أ</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سعر العطر العادي (110 مل)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={base110}
                  onChange={(e) => setBase110(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-left"
                  dir="ltr"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">د.أ</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رسوم التوصيل الأساسية
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={shipping}
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-left"
                  dir="ltr"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">د.أ</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingPricing}
            className="w-full py-3 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4 text-[#ba997a]" />
            <span>{isSavingPricing ? "جاري الحفظ..." : "حفظ التعديلات في قاعدة البيانات"}</span>
          </button>
        </form>
      )}

    </div>
  );
}
