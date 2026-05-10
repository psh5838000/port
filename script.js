const homeSearchForm = document.querySelector("[data-home-search]");

if (homeSearchForm) {
  homeSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(homeSearchForm).get("q") || "";
    window.location.href = `find.html?q=${encodeURIComponent(query)}`;
  });
}

const itemSearch = document.querySelector("#itemSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const placeFilter = document.querySelector("#placeFilter");
const statusFilter = document.querySelector("#statusFilter");
const resetFilters = document.querySelector("#resetFilters");
const lostCards = Array.from(document.querySelectorAll(".lost-card"));
const resultCount = document.querySelector("#resultCount");
const claimForm = document.querySelector("#claimForm");
const selectedItem = document.querySelector("#selectedItem");
const selectedStatus = document.querySelector("#selectedStatus");
const selectedName = document.querySelector("#selectedName");
const selectedDesc = document.querySelector("#selectedDesc");
const claimResult = document.querySelector("#claimResult");
const claimSubmit = claimForm?.querySelector("button[type='submit']");

function normalize(value) {
  return value.trim().toLowerCase();
}

function updateResults() {
  if (!lostCards.length) return;

  const keyword = normalize(itemSearch?.value || "");
  const category = categoryFilter?.value || "all";
  const place = placeFilter?.value || "all";
  const status = statusFilter?.value || "all";
  let visibleCount = 0;

  lostCards.forEach((card) => {
    const text = normalize(`${card.dataset.name} ${card.dataset.category} ${card.dataset.place} ${card.dataset.status} ${card.dataset.detail}`);
    const matchesKeyword = !keyword || text.includes(keyword);
    const matchesCategory = category === "all" || card.dataset.category === category;
    const matchesPlace = place === "all" || card.dataset.place === place;
    const matchesStatus = status === "all" || card.dataset.status === status;
    const visible = matchesKeyword && matchesCategory && matchesPlace && matchesStatus;

    card.style.display = visible ? "" : "none";
    if (visible) visibleCount += 1;
  });

  if (resultCount) {
    resultCount.textContent = `${visibleCount}개 표시 중`;
  }
}

function selectLostItem(card) {
  if (!claimForm || !selectedItem) return;

  selectedItem.style.display = "none";
  claimForm.classList.remove("hidden");
  selectedName.textContent = card.dataset.name;
  selectedDesc.textContent = card.dataset.detail;
  selectedStatus.textContent = card.dataset.status;
  selectedStatus.className = "status";

  if (card.dataset.status === "보관 중") {
    selectedStatus.classList.add("available");
    if (claimSubmit) {
      claimSubmit.disabled = false;
      claimSubmit.textContent = "수령 신청하기";
    }
  } else if (card.dataset.status === "수령 대기") {
    selectedStatus.classList.add("waiting");
    if (claimSubmit) {
      claimSubmit.disabled = false;
      claimSubmit.textContent = "추가 확인 요청하기";
    }
  } else {
    selectedStatus.classList.add("done");
    if (claimSubmit) {
      claimSubmit.disabled = true;
      claimSubmit.textContent = "수령 완료된 물품";
    }
  }

  claimResult.textContent = "";
}

[itemSearch, categoryFilter, placeFilter, statusFilter].forEach((control) => {
  control?.addEventListener("input", updateResults);
  control?.addEventListener("change", updateResults);
});

resetFilters?.addEventListener("click", () => {
  itemSearch.value = "";
  categoryFilter.value = "all";
  placeFilter.value = "all";
  statusFilter.value = "all";
  updateResults();
});

lostCards.forEach((card) => {
  card.querySelector(".detail-button")?.addEventListener("click", () => {
    selectLostItem(card);
  });
});

claimForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = `FD-${Math.floor(1000 + Math.random() * 9000)}`;
  claimResult.textContent = `수령 신청이 접수되었습니다. 수령 코드: ${code}`;
});

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get("q");

if (initialQuery && itemSearch) {
  itemSearch.value = initialQuery;
}

updateResults();

const registerForm = document.querySelector("#registerForm");
const regName = document.querySelector("#regName");
const previewName = document.querySelector("#previewName");
const registerResult = document.querySelector("#registerResult");

regName?.addEventListener("input", () => {
  previewName.textContent = regName.value.trim() || "새로 등록될 물품";
});

registerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = regName.value.trim() || "습득물";
  registerResult.textContent = `${name} 등록 요청이 접수되었습니다. 관리자 확인 후 목록에 표시됩니다.`;
  registerForm.reset();
  previewName.textContent = "새로 등록될 물품";
});
