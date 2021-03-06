/* eslint-env node */

const { execFileSync } = require('child_process');
const { module: Qmodule, test } = require('qunitjs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

function findDocument(filename) {
  let dom = new JSDOM(fs.readFileSync(`dist/${filename}`))
  return dom.window.document;
}

Qmodule('Prember', function(hooks) {

  hooks.before(async function() {
    if (!process.env.REUSE_FASTBOOT_BUILD) {
      execFileSync('node', ['./node_modules/.bin/ember', 'build']);
    }
    process.env.REUSE_FASTBOOT_BUILD = true;
  });

  test('it renders /', function(assert) {
    let doc = findDocument('index.html');
    assert.equal(doc.querySelector('[data-test-id="index-content"]').textContent, 'This is some content');
  })

  test('it works with ember-cli-head', function(assert) {
    let doc = findDocument('index.html');
    assert.equal(doc.querySelector('meta[property="og:description"]').content, "OG Description from Index Route");
  })

  test('it works with ember-cli-document-title', function(assert) {
    let doc = findDocument('index.html');
    assert.equal(doc.querySelector('title').textContent, "Document Title from Index Route");
  })

  test('the URL discovery function can crawl the running app', function(assert) {
    // this test is relying on configuration in our ember-cli-build.js
    let doc = findDocument('discovered/index.html');
    assert.equal(doc.querySelector('h1').textContent, "Discovered");
  })

  test('the URL discovery function can inspect the app build output', function(assert) {
    // this test is relying on configuration in our ember-cli-build.js
    let doc = findDocument('from-sample-data/index.html');
    assert.equal(doc.querySelector('h1').textContent, "From Sample Data");
  })

});
