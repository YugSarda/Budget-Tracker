// src/components/ReceiptScanner.jsx
import { useState } from "react";
import axios from "axios";

const ReceiptScanner = ({ onExtract }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // const handleScan = async () => {
  //   if (!image) return;
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append("file", image);
  //   formData.append("language", "eng");
  //   formData.append("apikey", "OCR_API_KEY"); // Replace with your OCR.space API key
  //   formData.append("isOverlayRequired", false);

  //   try {
  //     const res = await axios.post("https://api.ocr.space/parse/image", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     const parsedText = res.data?.ParsedResults?.[0]?.ParsedText || "";
  //     setText(parsedText);

  //     // Basic extraction logic (you can improve this with NLP)
  //     const lines = parsedText.split("\n").filter(Boolean);
  //     let foundTitle = "";
  //     let foundAmount = 0;

  //     for (let line of lines) {
  //       const amountMatch = line.match(/₹?\s?(\d+(\.\d{1,2})?)/);
  //       if (amountMatch) {
  //         foundAmount = parseFloat(amountMatch[1]);
  //         foundTitle = line.replace(amountMatch[0], "").trim();
  //         break;
  //       }
  //     }

  //     onExtract({
  //       title: foundTitle || "Receipt Item",
  //       amount: foundAmount || 0,
  //     });
  //   } catch (err) {
  //     console.error("OCR failed", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleScan = async () => {
  if (!image) return;
  setLoading(true);
  const formData = new FormData();
  formData.append("file", image);

  try {
    const res = await axios.post("http://localhost:5000/api/receipt-scan/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const parsedText = res.data.text || "";
    setText(parsedText);

    // Basic extraction logic (you can improve this with NLP)
    const lines = parsedText.split("\n").filter(Boolean);
    let foundTitle = "";
    let foundAmount = 0;

    for (let line of lines) {
      const amountMatch = line.match(/₹?\s?(\d+(\.\d{1,2})?)/);
      if (amountMatch) {
        foundAmount = parseFloat(amountMatch[1]);
        foundTitle = line.replace(amountMatch[0], "").trim();
        break;
      }
    }

    onExtract({
      title: foundTitle || "Receipt Item",
      amount: foundAmount || 0,
    });
  } catch (err) {
    console.error("OCR failed", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">🧾 Scan Receipt</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleScan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!image || loading}
      >
        {loading ? "Scanning..." : "Scan Receipt"}
      </button>

      {text && (
        <div className="mt-4 text-sm text-gray-600 whitespace-pre-wrap">
          <strong>Extracted Text:</strong>
          <br />
          {text}
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
