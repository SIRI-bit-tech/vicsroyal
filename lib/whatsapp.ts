import { formatNaira } from './format-currency';
import { OrderItemSnapshot } from '../types/order';

export interface WhatsAppMessageParams {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  notes?: string | null;
  promoCode?: string | null;
  items: OrderItemSnapshot[];
  totalAmount: number;
  baseUrl: string;
  adminWhatsAppNumber: string;
}

export function buildWhatsAppOrderUrl(params: WhatsAppMessageParams): string {
  const {
    customerName,
    phoneNumber,
    deliveryAddress,
    notes,
    promoCode,
    items,
    totalAmount,
    baseUrl,
    adminWhatsAppNumber,
  } = params;

  let message = `*NEW ORDER — VIC ROYAL BEAUTY*\n\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📞 *Phone:* ${phoneNumber}\n`;
  message += `📍 *Delivery Address:* ${deliveryAddress}\n`;
  if (promoCode) {
    message += `🎟️ *Promo Code:* ${promoCode.toUpperCase()}\n`;
  }
  if (notes) {
    message += `📝 *Notes:* ${notes}\n`;
  }
  message += `\n------------------------------\n`;
  message += `*ORDERED ITEMS:*\n\n`;

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.quantity} × ${formatNaira(item.price)} = ${formatNaira(itemTotal)}\n`;
    message += `   Link: ${baseUrl}/product/${item.slug}\n\n`;
  });

  message += `------------------------------\n`;
  message += `💰 *TOTAL AMOUNT:* ${formatNaira(totalAmount)}\n\n`;
  message += `Please confirm payment details and delivery options. Thank you!`;

  const cleanNumber = adminWhatsAppNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
