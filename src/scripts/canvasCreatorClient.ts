import CanvasCreator from 'canvascreator';

type CanvasCreatorHost = HTMLElement & {
  dataset: DOMStringMap;
};

function getBooleanFlag(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) return defaultValue;
  return value !== 'false';
}

document.querySelectorAll('.canvas-creator-host').forEach((host) => {
  if (!(host instanceof HTMLElement)) return;
  if (host.dataset.ccMounted === 'true') return;

  const canvasHost = host as CanvasCreatorHost;
  const {
    canvasId,
    locale,
    assetBase,
    mode,
    fitToContainer,
    compact,
    maxWidth,
    maxHeight,
    toolbarImport,
    toolbarMetadata,
    toolbarExport,
    toolbarThemePicker,
    toolbarHelp,
    toolbarHeaderLinks,
  } = canvasHost.dataset;

  const options: Parameters<typeof CanvasCreator.initCanvasCreator>[0] = {
    container: canvasHost,
    assetBase,
    locale,
    mode,
    fitToContainer: getBooleanFlag(fitToContainer, true),
    compact: getBooleanFlag(compact, true),
    toolbar: {
      import: getBooleanFlag(toolbarImport, true),
      metadata: getBooleanFlag(toolbarMetadata, true),
      export: getBooleanFlag(toolbarExport, true),
      themePicker: getBooleanFlag(toolbarThemePicker, true),
      help: toolbarHelp === 'true',
      headerLinks: toolbarHeaderLinks === 'true',
    },
  };

  if (canvasId) {
    options.canvas = canvasId;
  }

  if (maxWidth) {
    options.maxWidth = maxWidth;
  }

  if (maxHeight) {
    options.maxHeight = maxHeight;
  }

  CanvasCreator.initCanvasCreator(options);
  host.dataset.ccMounted = 'true';
});
