import { ESLint } from "eslint";
import * as prettier from "prettier";
import { describe, expect, it } from "vitest";

const filePath = "src/jsx-spacing-fixture.tsx";
const eslint = new ESLint({ fix: true });

async function formatAndLint(source) {
  const config = await prettier.resolveConfig(filePath);
  const initial = await prettier.format(source, {
    ...config,
    filepath: filePath,
  });
  const [result] = await eslint.lintText(initial, { filePath });
  expect(result.messages).toEqual([]);

  const output = await prettier.format(result.output ?? initial, {
    ...config,
    filepath: filePath,
  });
  const [check] = await eslint.lintText(output, { filePath });
  expect(check.messages).toEqual([]);
  expect(check.output).toBeUndefined();

  return { initial, output };
}

describe("JSX blank lines", () => {
  it("separates sibling elements, expressions, and fragments at each level", async () => {
    const { output } = await formatAndLint(`
      export function Example({ title }: { title: string }) {
        return <>
          <h1>{title}</h1>
          <p className="detailFacts">Details</p>
          {title && <aside>Extra</aside>}
          <><span>Nested</span><span>Sibling</span></>
          <footer>Footer</footer>
        </>;
      }
    `);
    expect(output).toMatch(/<\/h1>\n\n\s+<p/);
    expect(output).toMatch(/<\/p>\n\n\s+\{title/);
    expect(output).toMatch(/<\/aside>\}\n\n\s+<>/);
    expect(output).toMatch(/Nested<\/span>\n\n\s+<span>Sibling/);
    expect(output).toMatch(/<\/>\n\n\s+<footer>/);
  });

  it("preserves mixed text, explicit spaces, and comments", async () => {
    const { initial, output } = await formatAndLint(`
      export function Example({ count }: { count: number }) {
        return <div>
          <p><strong>Price</strong>{" "}<span>per month</span></p>

          <p><strong>Label</strong> text <span>value</span></p>

          <p>
            {count} rooms · {count}{" "}
            {count}
            {count > 0 ? "available" : "unavailable"}
          </p>

          <section>
            <span>Before</span>
            {/* explanation */}
            <span>After</span>
          </section>
        </div>;
      }
    `);
    expect(output).toBe(initial);
  });

  it("keeps existing separators and sole children unchanged", async () => {
    const { initial, output } = await formatAndLint(`
      export function Example() {
        return <section>
          <div><span>Only child</span></div>

          <footer>Already separated</footer>
        </section>;
      }
    `);
    expect(output).toBe(initial);
  });
});
