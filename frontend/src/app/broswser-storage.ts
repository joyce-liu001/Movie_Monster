const KEY = 'redux';
export function loadState() {
  try {
    const serializedState = window.localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export async function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(KEY, serializedState);
  } catch (e) {
    // Ignore
  }
}
