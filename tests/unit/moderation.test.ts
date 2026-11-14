import { describe, it, expect } from "vitest";
import { containsBannedWords } from "@/lib/moderation";

describe("Moderation Filter (containsBannedWords)", () => {
  describe("Nội dung hợp lệ (Không chứa từ cấm)", () => {
    it("chấp nhận các bình luận khen ngợi hoặc trao đổi văn minh", () => {
      expect(
        containsBannedWords(
          "Trang web portfolio rất chỉn chu, mình rất thích giao diện dark mode!"
        )
      ).toBe(false);
      expect(
        containsBannedWords(
          "Chúc bạn sớm tìm được công việc phù hợp tại các công ty công nghệ."
        )
      ).toBe(false);
      expect(
        containsBannedWords(
          "Next.js 14 App Router và Server Actions hoạt động rất mượt mà."
        )
      ).toBe(false);
    });

    it("không bắt nhầm (false positive) các từ thông dụng tiếng Việt", () => {
      // Từ 'buổi' trong 'buổi sáng' không bị nhầm với từ thô tục
      expect(
        containsBannedWords(
          "Chào buổi sáng! Chúc tác giả một ngày làm việc hiệu quả."
        )
      ).toBe(false);

      // Từ 'du' trong 'du lịch', 'du học' không bị bắt nhầm
      expect(
        containsBannedWords("Bạn có thích đi du lịch và tìm hiểu văn hóa mới?")
      ).toBe(false);

      // Từ 'các' trong 'các bạn' không bị bắt nhầm
      expect(
        containsBannedWords("Chào tất cả các bạn lập trình viên trẻ.")
      ).toBe(false);

      // Từ 'lon' trong 'lon nước' không bị bắt nhầm
      expect(
        containsBannedWords("Vừa uống lon nước vừa đọc case study kỹ thuật.")
      ).toBe(false);

      // Từ 'cá' trong 'con cá' hoặc 'cá nhân' không bị nhầm với 'cá độ'
      expect(
        containsBannedWords(
          "Quan điểm cá nhân của mình là dự án này được kiến trúc rất bài bản."
        )
      ).toBe(false);
    });

    it("xử lý an toàn với chuỗi rỗng hoặc dữ liệu không hợp lệ", () => {
      expect(containsBannedWords("")).toBe(false);
      // @ts-expect-error kiểm tra dữ liệu null
      expect(containsBannedWords(null)).toBe(false);
      // @ts-expect-error kiểm tra dữ liệu undefined
      expect(containsBannedWords(undefined)).toBe(false);
    });
  });

  describe("Nội dung vi phạm nhóm Cờ bạc, Cá độ, Lừa đảo, Spam", () => {
    it("phát hiện các từ khóa cá độ bóng đá và cờ bạc", () => {
      expect(
        containsBannedWords("Tham gia cá độ thể thao tại sảnh game ngay.")
      ).toBe(true);
      expect(
        containsBannedWords("Keo bong toi nay cuc ngon, danh bac de giau.")
      ).toBe(true);
      expect(
        containsBannedWords("Cổng game casino trực tuyến nạp rút 1-1.")
      ).toBe(true);
    });

    it("phát hiện tài xỉu, nổ hũ, lô đề, soi cầu", () => {
      expect(
        containsBannedWords("Trang chơi tài xỉu online uy tín nhất 2026.")
      ).toBe(true);
      expect(
        containsBannedWords("Săn nổ hũ jackpot hàng tỷ đồng mỗi ngày.")
      ).toBe(true);
      expect(
        containsBannedWords("Soi cầu lô đề bạch thủ miền Bắc hôm nay.")
      ).toBe(true);
      expect(containsBannedWords("Đánh lo de kiếm tiền nhanh chóng.")).toBe(
        true
      );
    });

    it("phát hiện tên các nhà cái phổ biến", () => {
      expect(
        containsBannedWords("Đăng ký kubet nhận ngay 100k vào tài khoản.")
      ).toBe(true);
      expect(containsBannedWords("Link thabet vip không bị chặn.")).toBe(true);
      expect(containsBannedWords("Nhà cái bet88 hàng đầu châu Á.")).toBe(true);
      expect(containsBannedWords("Truy cập shbet chơi ngay.")).toBe(true);
    });

    it("phát hiện dịch vụ đen và spam", () => {
      expect(
        containsBannedWords("Hỗ trợ cho vay nặng lãi không giữ giấy tờ.")
      ).toBe(true);
      expect(
        containsBannedWords("Dịch vụ hack like, hack follow giá cực rẻ.")
      ).toBe(true);
      expect(
        containsBannedWords("Mua view TikTok tự động tăng tương tác.")
      ).toBe(true);
      expect(
        containsBannedWords("Crypto pump and dump group join now.")
      ).toBe(true);
    });
  });

  describe("Nội dung vi phạm nhóm Ngôn từ xúc phạm, thô tục", () => {
    it("phát hiện từ ngữ tục tĩu tiếng Việt (có dấu và viết tắt)", () => {
      expect(containsBannedWords("Đồ chó đẻ làm ăn vớ vẩn.")).toBe(true);
      expect(containsBannedWords("Thằng này nói chuyện ngu vcl.")).toBe(true);
      expect(containsBannedWords("Đm cái giao diện này nhìn đau mắt.")).toBe(
        true
      );
      expect(containsBannedWords("Trang web clgt này có gì hay ho đâu?")).toBe(
        true
      );
      expect(containsBannedWords("Địt mẹ mày bớt xàm đi.")).toBe(true);
      expect(containsBannedWords("Đụ má làm ăn tắc trách.")).toBe(true);
    });

    it("phát hiện từ ngữ tục tĩu tiếng Anh", () => {
      expect(containsBannedWords("What the fuck are you doing?")).toBe(true);
      expect(containsBannedWords("This project is complete shit.")).toBe(true);
      expect(containsBannedWords("You are an asshole.")).toBe(true);
      expect(containsBannedWords("Get out you bitch.")).toBe(true);
    });

    it("xử lý chuẩn không phân biệt chữ hoa hay chữ thường (case-insensitive)", () => {
      expect(containsBannedWords("CÁ ĐỘ BÓNG ĐÁ")).toBe(true);
      expect(containsBannedWords("KUBET")).toBe(true);
      expect(containsBannedWords("FUCKING SHIT")).toBe(true);
      expect(containsBannedWords("tÀi XỉU")).toBe(true);
    });
  });
});
