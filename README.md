# APIOps Cycles Method

The site is published at (https://www.apiopscycles.com/)

This repository contains the source for the APIOps Cycles documentation site built with [Astro](https://astro.build/) and the [Starlight](https://starlight.astro.build/) theme. The site content is primarily generated from JSON files describing the "metro map" of the method.

## Requirements

- **Node.js 22** or newer
- npm

Install dependencies once with:

```bash
npm install
```

## Local development

Run a local dev server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

If you add or change icons in the documentation, regenerate icon imports:

```bash
npm run generate:icons
```

If you update any JSON under `src/data/method/` or markdown content under `src/snippets/` linked to the JSON files, regenerate the Markdown files:

```bash
npm run generate:method
```

## Contributing

### Reporting issues or requesting features

If you spot a problem in the documentation or have an idea for new content, please open an issue in this repository. Include links to the relevant page or JSON file and describe the change you would like to see.

### Editing or adding content

Most pages are generated from the JSON files in `src/data/method/`. Some longer or more complex resource pages like the API Audit Checklist also use markdown snippets `src/snippets/`  linked to the resource.json. Do not use any frontmatter in the snippet files. Any supported markdown markup is ok. See references from [Starlight markdown reference](https://starlight.astro.build/guides/authoring-content/) and [Extended markdown reference](https://www.markdownguide.org/extended-syntax/).

After editing these files, run `npm run generate:method` to update the Markdown files in `src/content/docs/`. Note that the generated markdown files are not inlcuded in version control to avoid confusion on where editing should happen.

For fixes in the Markdown files included in version control under `src/content/docs/`, edit them directly.

### Making code or style changes

If you need to update components, styling or other configuration, follow the steps in **Local development** above to test your changes locally. Global styles live in `src/styles/global.css` and custom components are in `src/components/`.

Please make sure the site builds (`npm run build`) before submitting a pull request.

## Repository structure

```
.
├── public/                 # Static files
├── src/
│   ├── assets/             # Images and other assets
│   ├── components/         # Astro components
│   ├── content/            # Markdown/MDX pages
│   ├── data/method/        # JSON data used to generate docs
│   ├── snippets/           # Markdown files used for long content for resource docs
│   └── styles/             # Tailwind and global CSS
├── scripts/                # Utility scripts
├── astro.config.mjs        # Astro + Starlight configuration
└── package.json
```

## License

All content in this repository is provided under the CC BY-SA 4.0 license unless noted otherwise.