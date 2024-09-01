import React from "react";
import QRCode from "react-qr-code";

interface MaterialQRCodeProps {
  value: string;
}

export function MaterialQRCode({ value }: MaterialQRCodeProps) {
  return (
    <div>
      <QRCode value={value} />
    </div>
  );
}
