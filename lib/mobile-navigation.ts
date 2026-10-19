type MenuHistory = Pick<History, "state" | "pushState" | "replaceState" | "back">;

const MENU_ENTRY = "bavexaMobileMenu";

// Preserve Next's router state and use a same-URL entry so mobile Back dismisses
// the menu. Link navigation replaces that entry instead of leaving a duplicate.
export function createMobileNavigationHistory(history: MenuHistory, onBack: () => void) {
  const entryId = crypto.randomUUID();
  let active = false;
  const ownsEntry = () => history.state?.[MENU_ENTRY] === entryId;

  return {
    open(url: string) {
      if (active) return;
      history.pushState({ ...history.state, [MENU_ENTRY]: entryId }, "", url);
      active = true;
    },
    close() {
      if (!active) return;
      active = false;
      if (ownsEntry()) history.back();
    },
    prepareNavigation() {
      active = false;
      if (!ownsEntry()) return;
      const state = { ...history.state };
      delete state[MENU_ENTRY];
      history.replaceState(state, "");
    },
    handlePopState() {
      if (!active || ownsEntry()) return;
      active = false;
      onBack();
    },
  };
}
