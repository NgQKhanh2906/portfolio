import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const HOST = "127.0.0.1";
const PORT = 3100;
const BASE_URL = `http://${HOST}:${PORT}`;
const CDP_PORT = 9223;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const REQUIRED_CASE_STUDY_HEADINGS = [
  "Bối cảnh và bài toán",
  "Mục tiêu và ràng buộc",
  "Kiến trúc giải pháp",
  "Quyết định kỹ thuật và trade-off",
  "Thách thức và cách giải quyết",
  "Kết quả và bài học",
];

function log(message) {
  process.stdout.write(`${message}\n`);
}

function logError(message) {
  process.stderr.write(`${message}\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp200(url, timeoutMs = 25_000) {
  const start = Date.now();
  let lastError = "";
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res;
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url} (${lastError})`);
}

async function waitForCondition(fn, description, timeoutMs = 10_000, intervalMs = 100) {
  const start = Date.now();
  let lastResult;
  while (Date.now() - start < timeoutMs) {
    lastResult = await fn();
    if (lastResult) {
      return lastResult;
    }
    await sleep(intervalMs);
  }
  throw new Error(`Timed out waiting for: ${description} (last=${JSON.stringify(lastResult)})`);
}

/**
 * Minimal RFC-6455 WebSocket client fallback for Node.js < 22 when globalThis.WebSocket is absent.
 */
function openNodeNetWebSocket(wsUrl) {
  const parsed = new URL(wsUrl);
  const host = parsed.hostname;
  const port = Number(parsed.port || 80);
  const targetPath = `${parsed.pathname}${parsed.search}`;

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    const key = crypto.randomBytes(16).toString("base64");
    let upgraded = false;
    let buffer = Buffer.alloc(0);
    const listeners = { message: [], close: [], error: [] };

    const wrapper = {
      send(text) {
        const payload = Buffer.from(text, "utf8");
        const mask = crypto.randomBytes(4);
        let header;
        if (payload.length < 126) {
          header = Buffer.alloc(2);
          header[0] = 0x81;
          header[1] = 0x80 | payload.length;
        } else if (payload.length < 65536) {
          header = Buffer.alloc(4);
          header[0] = 0x81;
          header[1] = 0x80 | 126;
          header.writeUInt16BE(payload.length, 2);
        } else {
          header = Buffer.alloc(10);
          header[0] = 0x81;
          header[1] = 0x80 | 127;
          header.writeBigUInt64BE(BigInt(payload.length), 2);
        }
        const masked = Buffer.allocUnsafe(payload.length);
        for (let i = 0; i < payload.length; i += 1) {
          masked[i] = payload[i] ^ mask[i % 4];
        }
        socket.write(Buffer.concat([header, mask, masked]));
      },
      on(event, handler) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
      },
      close() {
        socket.end();
      },
    };

    function drainFrames() {
      while (buffer.length >= 2) {
        const byte0 = buffer[0];
        const byte1 = buffer[1];
        const opcode = byte0 & 0x0f;
        const masked = (byte1 & 0x80) !== 0;
        let len = byte1 & 0x7f;
        let offset = 2;

        if (len === 126) {
          if (buffer.length < 4) return;
          len = buffer.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (buffer.length < 10) return;
          len = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        const maskLen = masked ? 4 : 0;
        if (buffer.length < offset + maskLen + len) return;

        let payload = buffer.subarray(offset + maskLen, offset + maskLen + len);
        if (masked) {
          const maskKey = buffer.subarray(offset, offset + 4);
          const unmasked = Buffer.allocUnsafe(len);
          for (let i = 0; i < len; i += 1) {
            unmasked[i] = payload[i] ^ maskKey[i % 4];
          }
          payload = unmasked;
        }
        buffer = buffer.subarray(offset + maskLen + len);

        if (opcode === 0x8) {
          socket.end();
          return;
        }
        if (opcode === 0x9) {
          // Ping -> Pong
          const pongHeader = Buffer.from([0x8a, 0x80, 0, 0, 0, 0]);
          socket.write(pongHeader);
          continue;
        }
        if (opcode === 0x1 || opcode === 0x0) {
          const text = payload.toString("utf8");
          for (const handler of listeners.message) {
            handler(text);
          }
        }
      }
    }

    socket.on("connect", () => {
      socket.write(
        [
          `GET ${targetPath} HTTP/1.1`,
          `Host: ${host}:${port}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          "\r\n",
        ].join("\r\n"),
      );
    });

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (!upgraded) {
        const marker = buffer.indexOf("\r\n\r\n");
        if (marker === -1) return;
        const head = buffer.subarray(0, marker).toString("utf8");
        buffer = buffer.subarray(marker + 4);
        if (!head.includes("101")) {
          reject(new Error(`WebSocket upgrade failed: ${head}`));
          return;
        }
        upgraded = true;
        resolve(wrapper);
      }
      if (upgraded && buffer.length > 0) {
        drainFrames();
      }
    });

    socket.on("error", (err) => {
      if (!upgraded) reject(err);
      for (const handler of listeners.error) handler(err);
    });

    socket.on("close", () => {
      for (const handler of listeners.close) handler();
    });
  });
}

async function createCdpClient(wsUrl) {
  let socket;
  if (typeof globalThis.WebSocket === "function") {
    socket = await new Promise((resolve, reject) => {
      const ws = new globalThis.WebSocket(wsUrl);
      const handlers = { message: [], close: [], error: [] };
      ws.addEventListener("open", () => {
        resolve({
          send(text) {
            ws.send(text);
          },
          on(event, handler) {
            if (handlers[event]) handlers[event].push(handler);
          },
          close() {
            ws.close();
          },
        });
      });
      ws.addEventListener("message", (event) => {
        const text = typeof event.data === "string" ? event.data : String(event.data);
        for (const handler of handlers.message) handler(text);
      });
      ws.addEventListener("error", (event) => {
        const err = new Error(`WebSocket error: ${event.type}`);
        reject(err);
        for (const handler of handlers.error) handler(err);
      });
      ws.addEventListener("close", () => {
        for (const handler of handlers.close) handler();
      });
    });
  } else {
    socket = await openNodeNetWebSocket(wsUrl);
  }

  let nextId = 1;
  const pending = new Map();
  const eventHandlers = new Map();

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw);
    if (typeof msg.id === "number") {
      const entry = pending.get(msg.id);
      if (entry) {
        pending.delete(msg.id);
        if (msg.error) {
          entry.reject(new Error(`CDP error (${msg.error.code}): ${msg.error.message}`));
        } else {
          entry.resolve(msg.result);
        }
      }
    } else if (msg.method) {
      const list = eventHandlers.get(msg.method) ?? [];
      for (const handler of list) {
        handler(msg.params ?? {});
      }
    }
  });

  function send(method, params = {}) {
    const id = nextId;
    nextId += 1;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  function on(method, handler) {
    const list = eventHandlers.get(method) ?? [];
    list.push(handler);
    eventHandlers.set(method, list);
  }

  function close() {
    socket.close();
  }

  return { send, on, close };
}

async function openNewTarget() {
  let res = await fetch(`http://${HOST}:${CDP_PORT}/json/new?about:blank`, {
    method: "PUT",
  });
  if (!res.ok) {
    res = await fetch(`http://${HOST}:${CDP_PORT}/json/new?about:blank`);
  }
  assert.ok(res.ok, `Failed to open CDP page target: HTTP ${res.status}`);
  return res.json();
}

async function createPageController() {
  const target = await openNewTarget();
  const cdp = await createCdpClient(target.webSocketDebuggerUrl);

  const consoleErrors = [];
  const exceptions = [];
  const failedResponses = [];
  let documentStatus = 0;
  let mainFrameId = null;

  await cdp.send("Page.enable");
  await cdp.send("Page.bringToFront");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  await cdp.send("DOM.enable");

  const frameTree = await cdp.send("Page.getFrameTree");
  mainFrameId = frameTree?.frameTree?.frame?.id ?? null;

  cdp.on("Runtime.consoleAPICalled", (params) => {
    if (params.type === "error") {
      const args = (params.args ?? []).map((a) => a.value ?? a.description ?? "").join(" ");
      consoleErrors.push(args);
    }
  });

  cdp.on("Runtime.exceptionThrown", (params) => {
    const detail = params.exceptionDetails;
    exceptions.push(detail?.exception?.description ?? detail?.text ?? "Unknown runtime exception");
  });

  cdp.on("Network.responseReceived", (params) => {
    const res = params.response;
    if (!res) return;
    if (params.type === "Document" && (!mainFrameId || params.frameId === mainFrameId)) {
      if (res.url.startsWith(BASE_URL)) {
        documentStatus = res.status;
      }
    }
    if (res.status >= 400) {
      failedResponses.push({ status: res.status, url: res.url, type: params.type });
    }
  });

  function clearErrors() {
    consoleErrors.length = 0;
    exceptions.length = 0;
    failedResponses.length = 0;
    documentStatus = 0;
  }

  async function evalJs(expression) {
    const res = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(
        `evalJs exception: ${res.exceptionDetails.exception?.description ?? res.exceptionDetails.text}`,
      );
    }
    return res.result?.value;
  }

  async function goto(routePath, { allowStatus = 200 } = {}) {
    clearErrors();
    const url = `${BASE_URL}${routePath}`;
    const loadPromise = new Promise((resolve) => {
      const handler = () => resolve();
      cdp.on("Page.loadEventFired", handler);
    });

    await cdp.send("Page.navigate", { url });
    await Promise.race([loadPromise, sleep(8000)]);
    await sleep(450);

    if (documentStatus !== allowStatus) {
      throw new Error(`Expected HTTP ${allowStatus} on ${routePath}, got ${documentStatus}`);
    }
    return documentStatus;
  }

  async function assertCleanRuntime(routePath, { allowed404Path = null } = {}) {
    assert.deepEqual(
      consoleErrors,
      [],
      `Console errors on ${routePath}: ${JSON.stringify(consoleErrors)}`,
    );
    assert.deepEqual(
      exceptions,
      [],
      `Runtime exceptions on ${routePath}: ${JSON.stringify(exceptions)}`,
    );
    const unexpectedFailures = failedResponses.filter((item) => {
      if (allowed404Path && item.status === 404 && item.url.endsWith(allowed404Path)) {
        return false;
      }
      return true;
    });
    assert.deepEqual(
      unexpectedFailures,
      [],
      `Failed network responses on ${routePath}: ${JSON.stringify(unexpectedFailures)}`,
    );
  }

  async function pressKey(key, code, virtualKeyCode, modifiers = 0) {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "rawKeyDown",
      key,
      code,
      windowsVirtualKeyCode: virtualKeyCode,
      nativeVirtualKeyCode: virtualKeyCode,
      modifiers,
    });
    if (key === "Enter") {
      await cdp.send("Input.dispatchKeyEvent", {
        type: "char",
        text: "\r",
        unmodifiedText: "\r",
        key,
        code,
        windowsVirtualKeyCode: virtualKeyCode,
        nativeVirtualKeyCode: virtualKeyCode,
        modifiers,
      });
    }
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code,
      windowsVirtualKeyCode: virtualKeyCode,
      nativeVirtualKeyCode: virtualKeyCode,
      modifiers,
    });
  }

  async function clickSelector(selector) {
    const clicked = await evalJs(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.scrollIntoView({ block: "center", inline: "center" });
      el.click();
      return true;
    })()`);
    assert.ok(clicked, `Element not found for click: ${selector}`);
    await sleep(150);
  }

  async function clickButtonByText(text, exact = false) {
    const clicked = await evalJs(`(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const target = buttons.find((b) => {
        const content = (b.textContent || "").trim();
        return ${exact ? "content === " + JSON.stringify(text) : "content.includes(" + JSON.stringify(text) + ")"};
      });
      if (!target) return false;
      target.scrollIntoView({ block: "center", inline: "center" });
      target.click();
      return true;
    })()`);
    assert.ok(clicked, `Button not found with text "${text}"`);
    await sleep(150);
  }

  async function fillInput(selector, value) {
    const focused = await evalJs(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      el.focus();
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    })()`);
    assert.ok(focused, `Input not found: ${selector}`);
    await cdp.send("Input.insertText", { text: value });
    await sleep(100);
    const actual = await evalJs(`document.querySelector(${JSON.stringify(selector)})?.value`);
    assert.equal(actual, value, `Value mismatch on ${selector}`);
  }

  async function selectOption(selector, value) {
    const selected = await evalJs(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
      setter.call(el, ${JSON.stringify(value)});
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el.value === ${JSON.stringify(value)};
    })()`);
    assert.ok(selected, `Failed to select "${value}" on ${selector}`);
    await sleep(100);
  }

  async function setViewport({ width, height, mobile = false, hasTouch = false }) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: mobile ? 2 : 1,
      mobile,
    });
    await cdp.send("Emulation.setTouchEmulationEnabled", {
      enabled: hasTouch,
      maxTouchPoints: hasTouch ? 5 : 1,
    });
  }

  async function closeTarget() {
    cdp.close();
    await fetch(`http://${HOST}:${CDP_PORT}/json/close/${target.id}`).catch(() => {});
  }

  return {
    cdp,
    evalJs,
    goto,
    assertCleanRuntime,
    pressKey,
    clickSelector,
    clickButtonByText,
    fillInput,
    selectOption,
    setViewport,
    closeTarget,
  };
}

async function runViewportSuite(viewportName, viewportConfig) {
  log(`\n--- Running E2E suite for ${viewportName} (${viewportConfig.width}x${viewportConfig.height}) ---`);
  const page = await createPageController();

  try {
    await page.setViewport(viewportConfig);

    // 1. Route checks (HTTP 200, 0 console/runtime/network errors)
    const validRoutes = [
      "/",
      "/projects",
      "/projects/portfolio",
      "/projects/backend-services",
      "/contact",
    ];
    for (const route of validRoutes) {
      await page.goto(route, { allowStatus: 200 });
      const hasMain = await page.evalJs(`Boolean(document.querySelector("#main-content"))`);
      assert.ok(hasMain, `#main-content missing on ${route}`);
      await page.assertCleanRuntime(route);
      log(`[PASS] ${viewportName} GET ${route} -> 200, clean runtime`);
    }

    // 2. Custom 404 check
    await page.goto("/khong-ton-tai-404", { allowStatus: 404 });
    const has404Text = await page.evalJs(
      `document.body.innerText.includes("404 / NOT FOUND") && document.body.innerText.includes("Không tìm thấy trang")`,
    );
    assert.ok(has404Text, `Custom 404 text missing on ${viewportName}`);
    await page.assertCleanRuntime("/khong-ton-tai-404", { allowed404Path: "/khong-ton-tai-404" });
    log(`[PASS] ${viewportName} GET /khong-ton-tai-404 -> 404 custom page`);

    // 3. SkipLink + Navigation + Theme Toggle on '/'
    await page.goto("/", { allowStatus: 200 });
    let focusedHref = null;
    const tabTrace = [];
    for (let step = 1; step <= 3; step += 1) {
      await page.pressKey("Tab", "Tab", 9);
      const activeInfo = await page.evalJs(`(() => {
        const el = document.activeElement;
        return el ? { tag: el.tagName, href: el.getAttribute("href"), ariaLabel: el.getAttribute("aria-label") } : null;
      })()`);
      tabTrace.push(activeInfo);
      if (activeInfo?.href === "#main-content") {
        focusedHref = activeInfo.href;
        break;
      }
    }
    assert.equal(
      focusedHref,
      "#main-content",
      `Expected SkipLink focus on ${viewportName} (trace=${JSON.stringify(tabTrace)})`,
    );
    await page.pressKey("Enter", "Enter", 13);
    const currentHash = await page.evalJs(`window.location.hash`);
    assert.equal(currentHash, "#main-content", `Expected hash #main-content after SkipLink Enter`);
    log(`[PASS] ${viewportName} SkipLink keyboard flow (tabs=${tabTrace.length})`);

    // Theme Toggle
    const beforeDark = await page.evalJs(`document.documentElement.classList.contains("dark")`);
    await page.clickSelector('button[aria-label*="Chuyển sang giao diện"]');
    const afterDark = await page.evalJs(`document.documentElement.classList.contains("dark")`);
    assert.equal(afterDark, !beforeDark, `Theme toggle did not flip dark class on ${viewportName}`);
    const savedTheme = await page.evalJs(`window.localStorage.getItem("theme")`);
    assert.equal(savedTheme, afterDark ? "dark" : "light", `Theme not persisted in localStorage`);
    log(`[PASS] ${viewportName} ThemeToggle toggles dark class & localStorage`);

    // Navigation links
    if (viewportConfig.mobile) {
      await page.clickSelector('button[aria-label="Mở menu"]');
      const drawerOpen = await waitForCondition(
        () => page.evalJs(`Boolean(document.querySelector('[role="dialog"][aria-label="Menu điều hướng"]'))`),
        "mobile nav drawer open",
      );
      assert.ok(drawerOpen);
      await page.clickSelector('[role="dialog"][aria-label="Menu điều hướng"] a[href="/projects"]');
      await waitForCondition(
        () => page.evalJs(`window.location.pathname === "/projects"`),
        "navigate to /projects via mobile drawer",
      );
    } else {
      await page.clickSelector('header nav a[href="/projects"]');
      await waitForCondition(
        () => page.evalJs(`window.location.pathname === "/projects"`),
        "navigate to /projects via desktop header",
      );
    }
    log(`[PASS] ${viewportName} Navigation menu -> /projects`);

    // 4. Command Palette (Ctrl+K)
    await page.goto("/", { allowStatus: 200 });
    if (!viewportConfig.mobile) {
      await page.clickSelector('button[aria-label="Mở bảng lệnh (Ctrl+K)"]');
    } else {
      await page.pressKey("k", "KeyK", 75, 2);
    }
    await waitForCondition(
      () => page.evalJs(`Boolean(document.querySelector('input[placeholder*="Gõ lệnh hoặc tìm kiếm"]'))`),
      "CommandPalette input visible",
    );
    await page.fillInput('input[placeholder*="Gõ lệnh hoặc tìm kiếm"]', "du an");
    const hasProjectsCmd = await waitForCondition(
      () =>
        page.evalJs(`(() => {
          const items = Array.from(document.querySelectorAll('[cmdk-item]')).map((el) => (el.textContent || "").trim());
          return items.includes("Xem Dự án") && !items.some((t) => t.includes("Giao diện sáng"));
        })()`),
      "Xem Dự án command filtered",
    );
    assert.ok(hasProjectsCmd);
    await page.pressKey("Enter", "Enter", 13);
    await waitForCondition(
      () => page.evalJs(`window.location.pathname === "/projects"`),
      "CommandPalette navigates to /projects",
    );
    log(`[PASS] ${viewportName} Command Palette search & navigation`);

    // 5. Projects filter & Case Study detail (/projects -> /projects/portfolio)
    await page.goto("/projects", { allowStatus: 200 });
    await page.clickButtonByText("Next.js", true);
    await waitForCondition(
      () => page.evalJs(`window.location.search.includes("tech=nextjs")`),
      "URL updated with ?tech=nextjs",
    );
    const filteredText = await page.evalJs(`document.body.innerText`);
    assert.ok(filteredText.includes("Portfolio Web Application"));
    assert.ok(!filteredText.includes("Hệ thống Quản lý Bán hàng & Dịch vụ Backend"));

    await page.clickButtonByText("Xóa bộ lọc", false);
    await waitForCondition(
      () => page.evalJs(`window.location.search === ""`),
      "URL search cleared",
    );

    await page.goto("/projects/portfolio", { allowStatus: 200 });
    const caseStudyCheck = await page.evalJs(`(() => {
      const h2s = Array.from(document.querySelectorAll("article h2")).map((el) => (el.textContent || "").trim());
      return h2s;
    })()`);
    for (const expectedHeading of REQUIRED_CASE_STUDY_HEADINGS) {
      assert.ok(
        caseStudyCheck.some((h) => h.includes(expectedHeading)),
        `Missing Case Study heading "${expectedHeading}" on ${viewportName}`,
      );
    }

    if (viewportConfig.mobile) {
      const mobileTocOk = await page.evalJs(`Boolean(Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").includes("Mục lục bài viết")))`);
      assert.ok(mobileTocOk, "Mobile TOC toggle button missing");
    } else {
      const desktopTocOk = await page.evalJs(`Boolean(document.querySelector('nav[aria-label="Mục lục bài viết"]'))`);
      assert.ok(desktopTocOk, "Desktop sticky TOC nav missing");
    }
    await page.assertCleanRuntime("/projects/portfolio");
    log(`[PASS] ${viewportName} Projects filter + Case Study headings & TOC`);

    // 6. Contact form validation + delayed anti-bot submission
    const contactLoadStart = Date.now();
    await page.goto("/contact", { allowStatus: 200 });
    await page.clickSelector('form button[type="submit"]');
    const errorsVisible = await waitForCondition(
      () =>
        page.evalJs(
          `Boolean(document.querySelector("#contact-name-error") && document.querySelector("#contact-email-error") && document.querySelector("#contact-message-error"))`,
        ),
      "inline Vietnamese contact validation errors",
    );
    assert.ok(errorsVisible);

    await page.fillInput("#contact-name", "Nguyễn Văn Kiểm Thử");
    await page.fillInput("#contact-email", "e2e.verify@example.com");
    await page.selectOption("#contact-subject", "project");
    await page.fillInput(
      "#contact-message",
      "Tin nhắn kiểm thử E2E xác thực quy trình chống bot HMAC và gửi biểu mẫu liên hệ.",
    );

    const elapsed = Date.now() - contactLoadStart;
    if (elapsed < 3400) {
      await sleep(3400 - elapsed);
    }

    await page.clickSelector('form button[type="submit"]');
    const submittedOk = await waitForCondition(
      () => page.evalJs(`document.body.innerText.includes("Đã tiếp nhận tin nhắn")`),
      "contact submission confirmation message",
      10_000,
    );
    assert.ok(submittedOk);
    await page.assertCleanRuntime("/contact");
    log(`[PASS] ${viewportName} Contact form validation & submission`);
  } finally {
    await page.closeTarget();
  }
}

async function runHttpSeoAndSecurityChecks() {
  log("\n--- Running HTTP SEO & Security Headers checks ---");

  // 1. Sitemap
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  assert.equal(sitemapRes.status, 200, "GET /sitemap.xml must return 200");
  const sitemapXml = await sitemapRes.text();
  assert.ok(sitemapXml.includes("/projects/portfolio"), "sitemap.xml missing /projects/portfolio");
  assert.ok(sitemapXml.includes("/projects/backend-services"), "sitemap.xml missing /projects/backend-services");
  assert.ok(sitemapXml.includes("/contact"), "sitemap.xml missing /contact");
  assert.ok(!sitemapXml.includes("/lab"), "sitemap.xml must not contain /lab");
  assert.ok(!sitemapXml.includes("/guestbook"), "sitemap.xml must not contain /guestbook");
  log("[PASS] GET /sitemap.xml -> 200, valid routes");

  // 2. Robots
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  assert.equal(robotsRes.status, 200, "GET /robots.txt must return 200");
  const robotsTxt = await robotsRes.text();
  assert.ok(robotsTxt.includes("Disallow: /api/"), "robots.txt missing Disallow: /api/");
  assert.ok(robotsTxt.includes("sitemap.xml"), "robots.txt missing sitemap.xml");
  log("[PASS] GET /robots.txt -> 200, valid rules");

  // 3. Open Graph images
  for (const ogPath of ["/opengraph-image", "/projects/portfolio/opengraph-image"]) {
    const ogRes = await fetch(`${BASE_URL}${ogPath}`);
    assert.equal(ogRes.status, 200, `GET ${ogPath} must return 200`);
    const contentType = ogRes.headers.get("content-type") ?? "";
    assert.ok(contentType.includes("image/png"), `${ogPath} content-type must include image/png (got ${contentType})`);
    const bytes = Buffer.from(await ogRes.arrayBuffer());
    assert.equal(bytes.subarray(0, 4).toString("hex"), "89504e47", `${ogPath} invalid PNG magic bytes`);
    log(`[PASS] GET ${ogPath} -> 200, image/png (${bytes.length} bytes)`);
  }

  // 4. Security headers on GET /
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.equal(homeRes.status, 200, "GET / must return 200");
  const headers = homeRes.headers;
  assert.ok(headers.get("content-security-policy"), "Missing content-security-policy header");
  assert.ok(
    (headers.get("strict-transport-security") ?? "").includes("max-age=63072000"),
    "Missing or invalid strict-transport-security header",
  );
  assert.equal(headers.get("x-frame-options"), "DENY", "x-frame-options must be DENY");
  assert.equal(headers.get("x-content-type-options"), "nosniff", "x-content-type-options must be nosniff");
  assert.equal(
    headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
    "referrer-policy must be strict-origin-when-cross-origin",
  );
  assert.ok(
    (headers.get("permissions-policy") ?? "").includes("camera=()"),
    "Missing permissions-policy header",
  );
  assert.equal(headers.get("x-powered-by"), null, "x-powered-by header must be absent");
  log("[PASS] GET / security headers verified");
}

function killProcessTree(proc) {
  if (!proc) return;
  try {
    proc.stdout?.destroy();
    proc.stderr?.destroy();
  } catch {
    // Ignore stream destroy errors
  }
  if (proc.killed || !proc.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(proc.pid), "/T", "/F"], {
      stdio: "ignore",
      timeout: 3000,
    });
  } else {
    proc.kill("SIGKILL");
  }
}

async function main() {
  assert.ok(fs.existsSync(CHROME_PATH), `Chrome executable not found at ${CHROME_PATH}`);
  assert.ok(
    fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID")),
    ".next production build not found. Run `npm run build` before `npm run test:e2e:cdp`.",
  );

  const tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-cdp-"));
  let nextProc = null;
  let chromeProc = null;
  const serverLogs = [];

  try {
    log(`Starting Next.js production server on ${BASE_URL}...`);
    nextProc = spawn(
      process.execPath,
      [path.join("node_modules", "next", "dist", "bin", "next"), "start", "-p", String(PORT), "-H", HOST],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: "production" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    nextProc.stdout?.on("data", (d) => serverLogs.push(d.toString()));
    nextProc.stderr?.on("data", (d) => serverLogs.push(d.toString()));

    await waitForHttp200(`${BASE_URL}/`, 25_000);
    log("Next.js server is ready.");

    log(`Starting Headless Chrome with CDP port ${CDP_PORT}...`);
    chromeProc = spawn(
      CHROME_PATH,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        `--remote-debugging-port=${CDP_PORT}`,
        `--user-data-dir=${tempUserDataDir}`,
        "about:blank",
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    await waitForHttp200(`http://${HOST}:${CDP_PORT}/json/version`, 20_000);
    log("Headless Chrome CDP endpoint is ready.");

    await runHttpSeoAndSecurityChecks();
    await runViewportSuite("Desktop", { width: 1280, height: 720, mobile: false, hasTouch: false });
    await runViewportSuite("Mobile", { width: 390, height: 844, mobile: true, hasTouch: true });

    log("\nAll CDP E2E, SEO, and Security checks passed 100%.");
  } catch (err) {
    logError(`\nE2E verification failed: ${err instanceof Error ? err.stack || err.message : String(err)}`);
    if (serverLogs.length > 0) {
      logError("--- Recent Next.js server logs ---");
      logError(serverLogs.slice(-20).join(""));
    }
    process.exitCode = 1;
  } finally {
    killProcessTree(chromeProc);
    killProcessTree(nextProc);
    await sleep(400);
    try {
      fs.rmSync(tempUserDataDir, { recursive: true, force: true });
    } catch {
      // Ignore transient Windows file lock during cleanup
    }
  }
}

await main();
process.exit(process.exitCode ?? 0);
