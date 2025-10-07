import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode';

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
}));

const PORT = process.env.PORT || 4000;

function normalizeAmount(input) {
  const n = Number(input);
  if (!isFinite(n) || n <= 0) return null;
  return Number(n.toFixed(2));
}

function buildMessage(ref, note) {
  const parts = [];
  if (ref) parts.push(`REF:${String(ref).slice(0, 24)}`);
  if (note) parts.push(`NOTE:${String(note).slice(0, 48)}`);
  const msg = parts.join('|');
  return msg ? msg.slice(0, 64) : undefined;
}

// ✅ API ใหม่: POST /api/donate/qr
app.post('/api/donate/qr', async (req, res) => {
  try {
    const { amount, ref, note } = req.body;
    const safeAmount = normalizeAmount(amount);
    if (!safeAmount) {
      return res.status(400).json({ error: 'จำนวนเงินไม่ถูกต้อง' });
    }

    const ppId = (process.env.PROMPTPAY_ID || '').trim();
    if (!ppId) {
      return res.status(500).json({ error: 'ยังไม่ตั้งค่า PROMPTPAY_ID ใน .env' });
    }

    const payload = generatePayload(ppId, {
      amount: safeAmount,
      message: buildMessage(ref, note)
    });

    const dataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      width: 320,
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    res.json({
      payload,
      qr: dataUrl,
      amount: safeAmount,
      ref: ref || null,
      note: note || null,
      brand: process.env.BRAND_NAME || null
    });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'สร้าง QR ไม่สำเร็จ' });
  }
});

app.listen(PORT, () => {
  console.log(`Donate backend running on :${PORT}`);
});