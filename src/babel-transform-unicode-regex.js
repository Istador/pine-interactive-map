/**
 * Combines the following two babel plugins into one:
 * - @babel/plugin-transform-unicode-regex
 * - babel-plugin-transform-regexp-constructors
 *
 * And adds a runtime replacement of regular expressions.
 *
 * See https://github.com/babel/babel/issues/10523 for further details
 */

const rewritePattern = require('regexpu-core')
const { addDefault } = require('@babel/helper-module-imports')

let rewritePatternIdentifier

function convert(path, t) {
  const args = path.get('arguments')
  const evaluatedArgs = args.map((a) => a.evaluate())
  if (! evaluatedArgs[1] || ! evaluatedArgs[1].value || ! evaluatedArgs[1].value.includes('u')) { return }
  let pattern = evaluatedArgs[0]
  let flags   = evaluatedArgs[1].value

  if (pattern.confident) {
    return t.regExpLiteral(
      rewritePattern(pattern.value, flags),
      flags.replace('u', ''),
    )
  }
  else {
    if (! rewritePatternIdentifier) {
      rewritePatternIdentifier = addDefault(path, 'regexpu-core')
    }
    return t.newExpression(
      path.node.callee,
      [
        t.callExpression(
          rewritePatternIdentifier,
          [
            pattern.deopt.node,
          ],
        ),
        t.stringLiteral(flags.replace('u', '')),
      ],
    )
  }
}

function maybeReplaceRegExp(path, t) {
  if (! t.isIdentifier(path.node.callee, { name: 'RegExp' })) { return }
  const regexp = convert(path, t)
  if (regexp) {
    path.replaceWith(regexp)
  }
}

module.exports = function({ types: t }) {
  return {
    name: 'transform-unicode-regex',
    visitor: {
      RegExpLiteral({ node }) {
        if (! node.flags || ! node.flags.includes('u')) { return }
        node.pattern = rewritePattern(node.pattern, node.flags)
        node.flags = node.flags.replace('u', '')
      },
      NewExpression(path) {
        maybeReplaceRegExp(path, t)
      },
      CallExpression(path) {
        maybeReplaceRegExp(path, t)
      },
    },
  }
}
