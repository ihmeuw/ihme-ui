'use strict';

// EX. USAGE: $(npm bin)/react-docgen src/ui/legend/src/ | node ./scripts/build-doc.js

const fs = require('fs');
const path = require('path');

const Mustache = require('mustache');
const d3 = require('d3');
const assign = require('lodash/assign');
const transform = require('lodash/transform');

const generateMarkdownTable = require('./generate-markdown-table');

function buildTemplateView(api) {
  return transform(api, (accum, componentDescription, filepath) => {
    const fileDescription = path.parse(filepath);
    if (fileDescription.ext !== '.jsx') return accum;

    return assign(accum,
      {
        [fileDescription.name]: {
          name: fileDescription.name,
          description: componentDescription.description,
          props: generateMarkdownTable(componentDescription),
        },
      }
    );
  }, {});
}

function buildReadMe(filepath, view, done) {
  const fileDescription = path.parse(filepath);
  const componentBasePath = {
    root: fileDescription.root,
    dir: path.join(fileDescription.dir, '..'),
  };
  const templatePath = path.format(assign({}, componentBasePath, { base: '_readme.template.md' }));
  const readmePath = path.format(assign({}, componentBasePath, { base: 'README.md' }));

  fs.readFile(templatePath, { encoding: 'utf8' }, (readErr, template) => {
    if (readErr) {
      console.log(readErr);
      return done();
    }

    console.log(`Documenting ${fileDescription.name}`);
    fs.writeFile(readmePath, Mustache.render(template, view), done);
  });
}

/**
 * accept output from react-docgen, create READMEs
 * @param {Object} api
 */
function buildDocs(api) {
  const view = buildTemplateView(api);

  // build up readmes one at a time
  const queue = d3.queue(1);

  Object.keys(api).forEach((filepath) => {
    queue.defer(buildReadMe, filepath, view);
  });

  queue.await((err) => {
    if (err) {
      console.log(err);
    }

    console.log('Finished building docs');
  });
}

let json = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    json += chunk;
  }
});

process.stdin.on('end', () => {
  buildDocs(JSON.parse(json));
});
