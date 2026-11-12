/* ==========================================================================
   沃野红心 · 行动页脚本
   负责：行动清单本地保存、进度环、Canvas 青春承诺卡
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 行动清单 ---------- */

  const checklist = document.querySelector("[data-checklist]");
  const boxes = checklist ? Array.from(checklist.querySelectorAll("input[type='checkbox']")) : [];
  const ring = document.querySelector("[data-progress-ring]");
  const progressValue = document.querySelector("[data-progress-value]");
  const storageKey = "woye-actions-v1";

  function readChecklist() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const values = raw ? JSON.parse(raw) : [];
      return Array.isArray(values) ? values : [];
    } catch (error) {
      return [];
    }
  }

  function writeChecklist() {
    if (!boxes.length) return;
    const values = boxes.filter(function (box) {
      return box.checked;
    }).map(function (box) {
      return box.value;
    });
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch (error) {
      /* 本地存储不可用时，清单仍可在当前页面使用 */
    }
    updateProgress(values.length);
  }

  function updateProgress(done) {
    if (!boxes.length) return;
    const percent = Math.round((done / boxes.length) * 100);
    if (ring) {
      ring.style.setProperty("--progress", percent);
      ring.setAttribute("aria-label", "行动清单完成进度 " + percent + "%");
    }
    if (progressValue) progressValue.textContent = String(percent);
  }

  if (boxes.length) {
    const saved = readChecklist();
    boxes.forEach(function (box) {
      box.checked = saved.indexOf(box.value) !== -1;
      box.addEventListener("change", writeChecklist);
    });
    updateProgress(boxes.filter(function (box) { return box.checked; }).length);
  }

  /* ---------- 青春承诺卡 ---------- */

  const canvas = document.getElementById("commitment-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const nameInput = document.querySelector("[data-commitment-name]");
  const keywordButtons = Array.from(document.querySelectorAll("[data-keyword]"));
  const downloadButton = document.querySelector("[data-download]");
  const refreshButton = document.querySelector("[data-refresh]");

  const statements = {
    知农: "先读懂土地，再谈改变土地。\n我愿意从一次调查、一次劳动开始，认识真实的乡村。",
    爱农: "把心放在田野，把事做到地里。\n我愿意认真对待每一顿饭、每一寸土、每一个种地的人。",
    兴农: "用所学，解一亩田的难题。\n我愿意把专业知识带进田间，把论文写在真实的问题上。",
    强农: "把青春，写进农业强国的下一行。\n我愿意从一件小事做起，让土地因为我的到来有一点不同。"
  };

  let selectedKeyword = "知农";
  let variant = 0;

  const W = 1200;
  const H = 1600;

  function cutName() {
    const value = nameInput ? nameInput.value.trim() : "";
    return value || "一名甘农青年";
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split("\n");
    let cursorY = y;

    paragraphs.forEach(function (paragraph) {
      let line = "";
      for (let i = 0; i < paragraph.length; i += 1) {
        const test = line + paragraph[i];
        if (context.measureText(test).width > maxWidth && line) {
          context.fillText(line, x, cursorY);
          line = paragraph[i];
          cursorY += lineHeight;
        } else {
          line = test;
        }
      }
      if (line) {
        context.fillText(line, x, cursorY);
        cursorY += lineHeight;
      }
    });

    return cursorY;
  }

  function drawPattern() {
    context.save();

    if (variant === 0) {
      context.fillStyle = "rgba(169, 43, 34, 0.1)";
      context.beginPath();
      context.arc(940, 390, 190, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "rgba(169, 43, 34, 0.24)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(940, 390, 226, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = "#a92b22";
      context.beginPath();
      context.arc(940, 390, 112, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#f4eee2";
      context.font = '400 34px "Field Serif", "Songti SC", serif';
      context.textAlign = "center";
      context.fillText("1946—2026", 940, 350);
      context.font = '900 58px "Field Sans", "Microsoft YaHei", sans-serif';
      context.fillText("80", 940, 408);
      context.textAlign = "left";
    } else if (variant === 1) {
      context.strokeStyle = "rgba(169, 43, 34, 0.16)";
      context.lineWidth = 2;
      for (let i = 0; i < 9; i += 1) {
        const x = 760 + i * 42;
        context.beginPath();
        context.moveTo(x, 150);
        context.lineTo(x - 68, 700);
        context.stroke();
      }
    } else {
      context.strokeStyle = "rgba(199, 154, 74, 0.34)";
      context.lineWidth = 2;
      for (let r = 80; r <= 320; r += 60) {
        context.beginPath();
        context.arc(930, 1320, r, 0, Math.PI * 2);
        context.stroke();
      }
    }

    context.restore();
  }

  function drawSeal(cx, cy, radius) {
    context.save();
    context.translate(cx, cy);
    context.strokeStyle = "#a92b22";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();

    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(0, 0, radius - 12, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = "#a92b22";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = '400 38px "Field Serif", "Songti SC", serif';
    context.fillText("甘农", 0, -12);
    context.font = '700 20px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText("1946", 0, 30);
    context.restore();
  }

  function renderCard() {
    const name = cutName();
    const statement = statements[selectedKeyword];

    context.clearRect(0, 0, W, H);
    context.fillStyle = "#f4eee2";
    context.fillRect(0, 0, W, H);
    context.textBaseline = "top";

    drawPattern();

    // 外框与内框
    context.strokeStyle = "#a92b22";
    context.lineWidth = 8;
    context.strokeRect(42, 42, W - 84, H - 84);

    context.strokeStyle = "rgba(36, 27, 22, 0.22)";
    context.lineWidth = 1;
    context.strokeRect(72, 72, W - 144, H - 144);

    // 顶部信息
    context.fillStyle = "#a92b22";
    context.font = '900 30px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText("沃野红心", 110, 124);

    context.fillStyle = "#4a3b31";
    context.font = '400 22px "Field Serif", "Songti SC", serif';
    context.fillText("FIELD NOTES · GANSU AGRICULTURAL UNIVERSITY", 110, 168);

    context.textAlign = "right";
    context.fillStyle = "#a92b22";
    context.font = '800 24px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText("2026 / 青春承诺卡", W - 110, 140);
    context.textAlign = "left";

    // 细线与标题
    context.fillStyle = "#a92b22";
    context.fillRect(110, 228, 84, 6);

    context.fillStyle = "#241b16";
    context.font = '900 122px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText("把青春", 108, 292);

    context.fillStyle = "#a92b22";
    context.fillText("种进沃野", 108, 426);

    // 关键词
    context.fillStyle = "#a92b22";
    context.font = '900 250px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText(selectedKeyword, 104, 638);

    context.fillRect(110, 918, 220, 10);

    // 承诺正文
    context.fillStyle = "#241b16";
    context.font = '400 43px "Field Serif", "Songti SC", serif';
    wrapText(statement, 110, 978, 850, 68);

    // 承诺人
    context.fillStyle = "#4a3b31";
    context.font = '800 30px "Field Sans", "Microsoft YaHei", sans-serif';
    context.fillText("承诺人 / " + name, 110, 1284);

    context.font = '400 26px "Field Serif", "Songti SC", serif';
    context.fillText("甘肃农业大学 · 一名甘农青年", 110, 1332);

    // 底部一句话
    context.fillStyle = "#a92b22";
    context.font = '400 30px "Field Serif", "Songti SC", serif';
    context.fillText("把论文写在大地上，把青春种进下一季。", 110, 1450);

    drawSeal(985, 1364, 86);

    // 四角刻度
    context.strokeStyle = "rgba(36, 27, 22, 0.4)";
    context.lineWidth = 1;
    const corners = [
      [96, 96, 1, 1],
      [W - 96, 96, -1, 1],
      [96, H - 96, 1, -1],
      [W - 96, H - 96, -1, -1]
    ];
    corners.forEach(function (corner) {
      context.beginPath();
      context.moveTo(corner[0], corner[1] + 18 * corner[3]);
      context.lineTo(corner[0], corner[1]);
      context.lineTo(corner[0] + 18 * corner[2], corner[1]);
      context.stroke();
    });
  }

  keywordButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedKeyword = button.dataset.keyword;
      keywordButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      renderCard();
    });
  });

  if (nameInput) {
    nameInput.addEventListener("input", renderCard);
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", function () {
      variant = (variant + 1) % 3;
      renderCard();
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      const safeName = cutName().replace(/[\\/:*?"<>|]/g, "");
      canvas.toBlob(function (blob) {
        if (!blob) return;
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = "沃野红心-青春承诺-" + safeName + ".png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1200);
      }, "image/png");
    });
  }

  renderCard();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderCard);
  }
})();
