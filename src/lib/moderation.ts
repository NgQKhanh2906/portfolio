/**
 * Danh sách cụm từ và từ khóa cấm thuộc các nhóm:
 * 1. Cá độ, cờ bạc, soi cầu, lừa đảo, cày thuê/spam
 * 2. Ngôn từ xúc phạm, thô tục, chửi thề (tiếng Việt & tiếng Anh)
 */
export const BANNED_PHRASES: string[] = [
  // Cờ bạc, cá độ, lừa đảo tài chính
  "cá độ",
  "ca do",
  "đánh bạc",
  "danh bac",
  "cờ bạc",
  "co bac",
  "casino",
  "lô đề",
  "lo de",
  "nổ hũ",
  "no hu",
  "kèo bóng",
  "keo bong",
  "soi cầu",
  "soi cau",
  "tài xỉu",
  "tai xiu",
  "kubet",
  "thabet",
  "bet88",
  "shbet",
  "w88",
  "fun88",
  "bk8",
  "12bet",
  "cho vay nặng lãi",
  "vay tien nong",
  "vay tiền nóng",
  "hack like",
  "hack follow",
  "mua view",
  "crypto pump",
  "free followers",
  "dating spam",

  // Xúc phạm, chửi thề đa từ
  "đụ má",
  "đụ mẹ",
  "du ma",
  "du me",
  "dit me",
  "địt mẹ",
  "chó đẻ",
  "cho de",
  "lon me",
  "lồn mẹ",
];

export const BANNED_WORDS: string[] = [
  // Tiếng Việt tục tĩu (có dấu hoặc từ viết tắt không trùng từ thông dụng)
  "địt",
  "đụ",
  "lồn",
  "buồi",
  "cặc",
  "đm",
  "dm",
  "dcm",
  "đcm",
  "vcl",
  "vkl",
  "clgt",
  "dkm",
  "đkm",

  // Tiếng Anh tục tĩu
  "fuck",
  "fucking",
  "fucker",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "nigger",
  "pussy",
  "dick",
];

// Tạo Regex biên từ Unicode hỗ trợ tiếng Việt
function createWordBoundaryRegex(word: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(^|[^\\p{L}\\p{N}_])${escaped}([^\\p{L}\\p{N}_]|$)`,
    "iu"
  );
}

const COMPILED_WORD_REGEXES = BANNED_WORDS.map((w) => ({
  word: w,
  regex: createWordBoundaryRegex(w),
}));

/**
 * Kiểm tra nội dung văn bản có chứa từ ngữ cấm (tục tĩu, cá độ, lừa đảo, xúc phạm) hay không.
 *
 * @param content Chuỗi nội dung cần kiểm tra
 * @returns true nếu phát hiện từ ngữ cấm, ngược lại false
 */
export function containsBannedWords(content: string): boolean {
  if (!content || typeof content !== "string") {
    return false;
  }

  const normalized = content.toLowerCase().normalize("NFC");

  // 1. Kiểm tra các cụm từ (phrases)
  for (const phrase of BANNED_PHRASES) {
    if (normalized.includes(phrase)) {
      return true;
    }
  }

  // 2. Kiểm tra các từ độc hại độc lập theo ranh giới từ (word boundary)
  for (const item of COMPILED_WORD_REGEXES) {
    if (item.regex.test(normalized)) {
      return true;
    }
  }

  return false;
}
