import {
  createComponentNode, getClasses, getPropertyValue, hasProperty,
  removeClass, setValueProperty, visitNodes
} from '../../ast/index.js';
import { languages } from './languages.js';

const LANGUAGE = 'language';

export default function(ast) {
  visitNodes(ast, node => {
    switch (node.name) {
      case 'code': return codeInline(node);
      case 'code-block': return codeBlock(node);
    }
  });
  return ast;
}

function codeAttributes(node) {
  if (!hasProperty(LANGUAGE)) {
    const classes = getClasses(node);
    const lang = classes.find(c => languages.has(c));
    if (lang) {
      removeClass(node, lang);
      setValueProperty(node, LANGUAGE, lang);
    }
  }
  return getPropertyValue(node, LANGUAGE);
}

function codeBlock(node) {
  if (!codeAttributes(node)) {
    node.name = 'pre';
    node.children = [ createComponentNode('code', null, node.children) ];
  }
}

function codeInline(node) {
  if (codeAttributes(node)) {
    node.name = 'code-block';
    setValueProperty(node, 'inline', true);
  }
}
