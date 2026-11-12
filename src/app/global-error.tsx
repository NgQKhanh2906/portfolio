"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-[#0B0B0C] text-[#EDEDEF] p-4 font-sans">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Đã có lỗi hệ thống nghiêm trọng</h1>
          <p className="text-sm text-[#A0A0A8] mb-6">
            Trang web gặp sự cố ở cấp độ toàn cục. Vui lòng thử tải lại trang.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-[#2DD4A3] text-[#04241B] rounded-md font-medium text-sm hover:bg-[#5EE3BB] transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </body>
    </html>
  );
}
