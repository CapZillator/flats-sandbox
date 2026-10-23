const jsxNodeTypes = new Set([
  "JSXElement",
  "JSXFragment",
  "JSXExpressionContainer",
]);

function isContentNode(node) {
  if (!jsxNodeTypes.has(node.type)) {
    return false;
  }

  // Explicit spaces and comments belong to the surrounding text.
  if (node.type === "JSXExpressionContainer") {
    const expression = node.expression;

    if (expression.type === "JSXEmptyExpression") {
      return false;
    }

    if (expression.type === "Literal" && typeof expression.value === "string") {
      return expression.value.trim().length > 0;
    }
  }

  return true;
}

const jsxBlankLines = {
  meta: {
    type: "layout",
    docs: {
      description: "Separate multiline JSX siblings with a blank line.",
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      missing: "Separate JSX siblings with a blank line.",
    },
  },
  create(context) {
    function checkSiblings(node) {
      const children = node.children;

      // Text mixed with expressions forms one sentence, even across lines.
      if (
        children.some(
          (child) =>
            (child.type === "JSXText" && child.value.trim() !== "") ||
            (child.type === "JSXExpressionContainer" &&
              child.expression.type === "Literal" &&
              typeof child.expression.value === "string" &&
              child.expression.value.trim() === ""),
        )
      ) {
        return;
      }

      for (let index = 1; index < children.length - 1; index += 1) {
        const gap = children[index];
        const previous = children[index - 1];
        const next = children[index + 1];

        if (
          gap.type !== "JSXText" ||
          gap.value.trim() !== "" ||
          !gap.value.includes("\n") ||
          /\n\s*\n/.test(gap.value) ||
          !isContentNode(previous) ||
          !isContentNode(next)
        ) {
          continue;
        }

        context.report({
          node: next,
          messageId: "missing",
          fix: (fixer) => fixer.insertTextBefore(gap, "\n"),
        });
      }
    }

    return {
      JSXElement: checkSiblings,
      JSXFragment: checkSiblings,
    };
  },
};

export default jsxBlankLines;
