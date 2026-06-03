let searchRoot: import("react-dom/client").Root | undefined;
let searchMount: HTMLElement | undefined;
let loadingSearch: Promise<void> | undefined;

const mountSearchModal = async () => {
  if (!loadingSearch) {
    loadingSearch = Promise.all([
      import("./SearchModal"),
      import("react"),
      import("react-dom/client"),
    ]).then(([{ default: SearchModal }, React, { createRoot }]) => {
      let mount = document.getElementById("search-modal-root");

      if (!mount) {
        mount = document.createElement("div");
        mount.id = "search-modal-root";
        document.body.appendChild(mount);
      }

      if (searchMount !== mount) {
        searchRoot = createRoot(mount);
        searchMount = mount;
      }

      const root = searchRoot;

      if (!root) {
        return;
      }

      root.render(React.createElement(SearchModal, { initialOpen: true }));
    });
  }

  await loadingSearch;
  window.dispatchEvent(new CustomEvent("be:open-search"));
};

document.addEventListener("click", (event) => {
  const trigger = (event.target as Element | null)?.closest(
    "[data-search-trigger]",
  );

  if (!trigger) {
    return;
  }

  event.preventDefault();
  void mountSearchModal();
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    void mountSearchModal();
  }
});
