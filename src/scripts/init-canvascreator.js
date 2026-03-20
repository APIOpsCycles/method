import canvascreator from 'canvascreator';

function initializeFromScriptTag(script) {
  if (!script) return;
  const canvasId = script.dataset.canvasId;
  if (!canvasId) return;
  canvascreator.initialize({ canvasId });
}

initializeFromScriptTag(document.currentScript);
