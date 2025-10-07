import React, { useState } from 'react';

const BACKEND = 'http://localhost:4000';

export default function App() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [qr, setQr] = useState(null);
  const [error, setError] = useState('');
  const [slip, setSlip] = useState(null);
const [slipSent, setSlipSent] = useState(false);

// 🔹 ฟังก์ชัน generateQR
async function generateQR() {
  try {
    const safeAmount = parseFloat(amount);
    if (!safeAmount || safeAmount <= 0) {
      setError('กรุณาใส่จำนวนเงินให้ถูกต้อง');
      return;
    }

    const res = await fetch(`${BACKEND}/api/donate/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: safeAmount, note })
    });
    const json = await res.json();
    if (json.error) {
      setError(json.error);
      return;
    }
    setQr(json.qr);
  } catch (err) {
    console.error('Error generating QR:', err);
    setError('ไม่สามารถสร้าง QR ได้');
  }
}

const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlip(URL.createObjectURL(file)); // preview
    }
  };

  const handleSendSlip = () => {
    if (slip) {
      setSlipSent(true);
    }
  };


  return (
    <>
      <style>{`
        /* ✅ Animation */
        @keyframes zoomIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
          @keyframes scrollLoop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* เลื่อนครึ่งหนึ่งของ track */
        }
          @keyframes moveLine {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
          @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .modal-content { animation: zoomIn 0.3s ease-out; }
        .create-qr-btn { animation: popIn 0.4s ease-out; }
        .qr-image { animation: zoomIn 0.4s ease-out; }
      `}</style>

      <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
        <h1>Rachata Support</h1>

            {/* ✅ การ์ดคำอธิบายหมวดหมู่แบบเลื่อนอัตโนมัติ smooth */}
<div style={{
  marginTop: 20,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  background: 'transparent',
  padding: '10px 0'
}}>
  <div className="scroll-track" style={{
    display: 'flex',
    gap: 16,
    width: 'max-content',
    animation: 'scrollLoop 20s linear infinite'
  }}>
    {[
      { label: 'ค่าอาหาร', desc: 'ค่าใช้จ่ายสำหรับมื้ออาหารประจำวัน' },
      { label: 'ค่าไฟฟ้า', desc: 'ค่าใช้จ่ายสำหรับการใช้ไฟฟ้าในบ้าน' },
      { label: 'ค่าเดินทาง', desc: 'ค่าใช้จ่ายสำหรับการเดินทางและค่าน้ำมัน' }
    ]
    // ✅ duplicate 2 รอบเพื่อให้เลื่อนไม่สะดุด
    .concat([
      { label: 'ค่าอาหาร', desc: 'ค่าใช้จ่ายสำหรับมื้ออาหารประจำวัน' },
      { label: 'ค่าไฟฟ้า', desc: 'ค่าใช้จ่ายสำหรับการใช้ไฟฟ้าในบ้าน' },
      { label: 'ค่าเดินทาง', desc: 'ค่าใช้จ่ายสำหรับการเดินทางและค่าน้ำมัน' }
    ])
    .map((item, idx) => (
      <div
        key={idx}
        style={{
          minWidth: 200,
          flexShrink: 0,
          padding: '16px 20px',
          borderRadius: 12,
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        {/* เส้น gradient เคลื่อนไหว */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 4,
            background: 'linear-gradient(90deg, #0078d7, #00c6ff, #0078d7)',
            backgroundSize: '200% 100%',
            animation: 'moveLine 3s linear infinite'
          }}
        />
        <h3 style={{ margin: '0 0 8px 0', color: '#0078d7' }}>{item.label}</h3>
        <p style={{ margin: 0, color: '#333' }}>{item.desc}</p>
      </div>
    ))}
  </div>
</div>

        {/* ✅ ช่องจำนวนเงิน */}
        <div style={{ marginBottom: 12 }}>
          <label>จำนวนเงิน (บาท)</label>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="ใส่จำนวนเงิน"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />

          {/* ✅ ปุ่มลัด */}
          <div style={{
            marginTop: 12,
            display: 'flex',
            gap: 10,
            justifyContent: 'space-between'
          }}>
            {[10, 20, 50, 100].map(val => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: '#e6f0ff',
                  border: '1px solid #0078d7',
                  borderRadius: 6,
                  color: '#0078d7',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#cce0ff';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#e6f0ff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {val} บาท
              </button>
            ))}
          </div>
        </div>

        {/* ✅ ช่องข้อความ */}
        <div style={{ marginBottom: 12 }}>
          <label>ส่งข้อความ</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="พิมพ์ข้อความของคุณ"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        {/* ✅ ปุ่มสร้าง QR */}
        <button
          onClick={generateQR}
          className="create-qr-btn"
          style={{
            padding: '12px 24px',
            background: '#0078d7',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          สร้าง QR
        </button>

        {/* ✅ แสดง QR */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {qr
            ? <img
                src={qr}
                alt="PromptPay QR"
                className="qr-image"
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
            : <span style={{ color: '#999' }}>QR จะปรากฏที่นี่</span>}
        </div>

        {/* ✅ ส่งสลิปโอนเงิน */}
<div style={{ marginTop: 30 }}>
  <h3>อัปโหลดสลิปการโอนเงิน</h3>
  <input
    type="file"
    accept="image/*"
    onChange={handleSlipUpload}
    style={{ marginBottom: 12 }}
  />

  {/* preview */}
  {slip && !slipSent && (
    <div style={{ marginBottom: 12, textAlign: 'center' }}>
      <img
        src={slip}
        alt="slip preview"
        style={{
          maxWidth: '100%',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          animation: 'zoomIn 0.3s ease-out'
        }}
      />
    </div>
  )}

  {/* ปุ่มส่ง */}
  {!slipSent && (
    <button
      onClick={handleSendSlip}
      style={{
        padding: '10px 20px',
        background: '#0078d7',
        color: '#fff',
        border: 'none',
        borderRadius: 50,
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s ease',
        transform: 'scale(1)'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ส่ง
    </button>
  )}

  {/* หลังส่งแล้ว */}
  {slipSent && (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        background: 'rgba(240,248,255,0.8)',
        textAlign: 'center',
        animation: 'zoomIn 0.3s ease-out'
      }}
    >
      <p style={{ marginBottom: 16, fontWeight: 'bold', color: '#0078d7' }}>
        ✅ ส่งสลิปแล้ว
      </p>
      <button
        onClick={() => {
          setSlip(null);
          setSlipSent(false);
        }}
        style={{
          padding: '8px 16px',
          background: '#0078d7',
          color: '#fff',
          border: 'none',
          borderRadius: 50,
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
          transform: 'scale(1)'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ตกลง
      </button>
    </div>
  )}
</div>

        {/* ✅ ข้อความขอบคุณ */}
<div
  style={{
    marginTop: 30,
    padding: '16px 20px',
    borderRadius: 12,
    background: '#f0f8ff',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }}
>
  {/* เส้น gradient เคลื่อนไหว */}
  <div
    style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, height: 4,
      background: 'linear-gradient(90deg, #ff7eb3, #ff758c, #ff7eb3)',
      backgroundSize: '200% 100%',
      animation: 'moveLine 3s linear infinite'
    }}
  />
  <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#d63384' }}>
    💖 ขอบคุณที่โดเนทให้น้าา 💖
  </p>
</div>

        {/* ✅ Modal แจ้งเตือน */}
        {error && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div
              className="modal-content"
              style={{
                background: '#fff',
                padding: 20,
                borderRadius: 12,
                maxWidth: 300,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <p style={{ marginBottom: 20, color: '#000' }}>{error}</p>
<button
  onClick={() => setError('')}
  style={{
    padding: '8px 16px',
    background: '#0078d7',
    color: '#fff',
    border: 'none',
    borderRadius: 50,   // 👈 มุมมนแบบ pill
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    transform: 'scale(1)'
  }}
  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
>
  เข้าใจแล้ว
</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}