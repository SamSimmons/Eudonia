import "@/test/register-dom";

import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { StatCard } from "./StatCard";
import styles from "./StatCard.module.css";

afterEach(() => {
  cleanup();
});

describe("StatCard", () => {
  test("keeps title/value shorthand as easy-mode body layout", () => {
    const { container, getByText } = render(<StatCard title="Customers" value="80" />);

    expect(getByText("Customers")).not.toBeNull();
    expect(getByText("80")).not.toBeNull();
    expect(container.querySelector(`.${styles.body}`)).not.toBeNull();
  });

  test("exposes composable layout helpers and card sparkline", () => {
    const { container, getByText } = render(
      <StatCard title="Revenue">
        <StatCard.Stack>
          <StatCard.Value>$1.2M</StatCard.Value>
          <StatCard.Sparkline values={[1, 2, 3]} width={120} height={40} />
        </StatCard.Stack>
      </StatCard>,
    );

    expect(getByText("$1.2M")).not.toBeNull();
    expect(container.querySelector(`.${styles.stack}`)).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
