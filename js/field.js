/* ==========================================================================
   沃野红心 · 田野页脚本
   负责：作物档案切换与小麦生长刻度
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 作物档案 ---------- */

  const cropData = {
    potato: {
      name: "甘农薯",
      latin: "Processing potato / SOLANUM TUBEROSUM",
      desc: "加工型马铃薯新品种，亩产超万斤。从脱毒种薯到田间管理，每一步都要和土地反复商量。它不只是一个品种，也是一条从试验田通向加工车间的产业链。",
      note: "“高产”不是终点。好吃、耐储、适合加工，才是市场真正关心的问题。育种要同时回答土地和市场的问题。",
      keyword: "#一粒种子的产业链",
      stats: [
        { label: "产量潜力", value: 92, display: "高" },
        { label: "加工适配", value: 86, display: "强" },
        { label: "推广基础", value: 78, display: "广" }
      ]
    },
    rapeseed: {
      name: "陇油",
      latin: "Winter rapeseed / BRASSICA NAPUS",
      desc: "超强抗寒的冬油菜品种。陇原的冬天很长，但总有一些绿色，愿意在风里等到春天。它让冬闲田不再空闲，也让土地的收获多了一季。",
      note: "抗寒，是陇原冬油菜的“入场券”。但真正让农民愿意种的，还要有稳定的产量和看得见的收益。",
      keyword: "#让冬闲田不闲",
      stats: [
        { label: "抗寒能力", value: 95, display: "强" },
        { label: "含油潜力", value: 82, display: "高" },
        { label: "适应范围", value: 76, display: "广" }
      ]
    },
    alfalfa: {
      name: "甘农紫花苜蓿",
      latin: "Alfalfa / MEDICAGO SATIVA",
      desc: "优质高产的紫花苜蓿，是牛羊的“口粮”，也是陇原草业与生态修复的重要支点。一棵草的根系，能守住一片土地的脾气。",
      note: "苜蓿的价值不只在产量。它还能固氮、改良土壤。种草，有时候也是在“养地”。",
      keyword: "#一棵草与一片土地",
      stats: [
        { label: "饲用品质", value: 88, display: "优" },
        { label: "生态价值", value: 90, display: "强" },
        { label: "耐旱表现", value: 84, display: "较强" }
      ]
    },
    machine: {
      name: "藜麦 · 胡麻",
      latin: "Harvester / MACHINE",
      desc: "国内首台藜麦、胡麻联合收割机在这里诞生。让一颗小种子，从试验田走向更大的产业，也让“谁来收、怎么收”不再卡住一季的收成。",
      note: "农机不是冷冰冰的铁。它要适应作物、适应地形，也要适应使用它的人。好机器的标准，是让农活轻一点。",
      keyword: "#让收获不再犯难",
      stats: [
        { label: "工作效率", value: 90, display: "高" },
        { label: "作物适配", value: 82, display: "广" },
        { label: "减损表现", value: 76, display: "较好" }
      ]
    }
  };

  const tabs = Array.from(document.querySelectorAll("[data-crop]"));
  const nameEl = document.querySelector("[data-crop-name]");
  const latinEl = document.querySelector("[data-crop-latin]");
  const descEl = document.querySelector("[data-crop-desc]");
  const noteEl = document.querySelector("[data-crop-note]");
  const keywordEl = document.querySelector("[data-crop-keyword]");
  const statsEl = document.querySelector("[data-crop-stats]");

  function renderCrop(key) {
    const data = cropData[key];
    if (!data) return;

    if (nameEl) nameEl.textContent = data.name;
    if (latinEl) latinEl.textContent = data.latin;
    if (descEl) descEl.textContent = data.desc;
    if (noteEl) noteEl.textContent = data.note;
    if (keywordEl) keywordEl.textContent = data.keyword;

    if (!statsEl) return;
    statsEl.replaceChildren();

    data.stats.forEach(function (stat) {
      const row = document.createElement("div");
      row.className = "crop-stat";

      const label = document.createElement("span");
      label.textContent = stat.label;

      const bar = document.createElement("div");
      bar.className = "crop-stat__bar";
      const fill = document.createElement("i");
      fill.style.setProperty("--value", stat.value + "%");
      bar.appendChild(fill);

      const value = document.createElement("b");
      value.textContent = stat.display;

      row.append(label, bar, value);
      statsEl.appendChild(row);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (item) {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      renderCrop(tab.dataset.crop);
    });
  });

  if (tabs.length > 0) renderCrop("potato");

  /* ---------- 生长刻度 ---------- */

  const range = document.querySelector("[data-growth-range]");
  const plant = document.querySelector("[data-plant]");
  const stageLabel = document.querySelector("[data-stage-label]");
  const growthValue = document.querySelector("[data-growth-value]");
  const caption = document.querySelector("[data-growth-caption]");
  const stageItems = Array.from(document.querySelectorAll("[data-growth-stages] [data-stage]"));

  const stages = [
    {
      min: 0,
      name: "秋播期",
      caption: "秋播期，种子入土。土壤的墒情、播种的深度，都会影响它能不能顺利出苗。"
    },
    {
      min: 20,
      name: "越冬期",
      caption: "越冬期，麦苗把根往深处扎。地上部分长得慢，地下的根系却在默默积蓄力量。"
    },
    {
      min: 42,
      name: "返青期",
      caption: "返青期，麦苗重新变绿。浇好返青水、施好返青肥，是一年收成的第一道关口。"
    },
    {
      min: 62,
      name: "拔节期",
      caption: "拔节期，茎秆迅速伸长，叶片面积增大，对水分和养分的需求也开始增加。"
    },
    {
      min: 80,
      name: "抽穗期",
      caption: "抽穗期，麦穗从叶鞘里探出头来。此时要保持水分供应，也要防好病虫害。"
    },
    {
      min: 96,
      name: "成熟期",
      caption: "成熟期，麦粒变硬，叶片转黄。一季的等待，终于有了可以称量的重量。"
    }
  ];

  function getStage(value) {
    let active = stages[0];
    stages.forEach(function (stage) {
      if (value >= stage.min) active = stage;
    });
    return active;
  }

  function updateGrowth(value) {
    if (!range) return;
    const active = getStage(value);
    const level = 0.42 + (value / 100) * 0.58;

    if (plant) plant.style.setProperty("--growth", level.toFixed(3));
    if (stageLabel) stageLabel.textContent = active.name;
    if (growthValue) growthValue.textContent = value + "%";
    if (caption) caption.textContent = active.caption;

    stageItems.forEach(function (item) {
      const stageValue = Number(item.dataset.stage);
      const isCurrent = stageValue === active.min;
      item.classList.toggle("is-current", isCurrent);
    });
  }

  if (range) {
    updateGrowth(Number(range.value));
    range.addEventListener("input", function () {
      updateGrowth(Number(range.value));
    });
  }
})();
