import { siteConfig } from "@/config/site";
import type { ContactInput, PaymentMethod } from "@/types";

type OrderNotificationInput = {
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
};

const resendEndpoint = "https://api.resend.com/emails";

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFICATION_EMAIL);
}

function formatMoney(value: number) {
  return `Tk ${new Intl.NumberFormat("en-BD").format(value)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendAdminEmail({ subject, html }: { subject: string; html: string }) {
  if (!isEmailConfigured()) return;
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !adminEmail) return;

  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${siteConfig.name} <onboarding@resend.dev>`,
        to: [adminEmail],
        subject,
        html,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn("Admin email notification was not sent.");
    }
  } catch {
    console.warn("Admin email notification was not sent.");
  }
}

export async function sendAdminOrderNotification(order: OrderNotificationInput) {
  const items = order.items.map((item) => `<li>${item.quantity} x ${escapeHtml(item.name)} - ${formatMoney(item.lineTotal)}</li>`).join("");

  await sendAdminEmail({
    subject: `New NexaNotion order ${order.orderNumber}`,
    html: `
      <h1>New order received</h1>
      <p><strong>Order:</strong> ${order.orderNumber}</p>
      <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
      <h2>Items</h2>
      <ul>${items}</ul>
      <p>Open the NexaNotion admin panel to verify payment and process the order.</p>
    `,
  });
}

export async function sendAdminContactNotification(message: ContactInput) {
  const subject = message.subject ? escapeHtml(message.subject) : "";

  await sendAdminEmail({
    subject: `New NexaNotion contact message${subject ? `: ${subject}` : ""}`,
    html: `
      <h1>New contact message</h1>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Phone:</strong> ${message.phone ? escapeHtml(message.phone) : "Not provided"}</p>
      <p><strong>Email:</strong> ${message.email ? escapeHtml(message.email) : "Not provided"}</p>
      <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
      <p>${escapeHtml(message.message).replaceAll("\n", "<br />")}</p>
      <p>Open the NexaNotion admin panel to reply or archive this message.</p>
    `,
  });
}
