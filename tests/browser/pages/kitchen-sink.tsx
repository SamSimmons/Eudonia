import { useEffect } from "react";
import { Screen, Flex, FlexItem } from "eudonia/layout";
import { installPerfMeasurement } from "../perf/measure";

/**
 * Dense stress-test surface. Add every new primitive here as it lands.
 * This page exists for performance measurement, not visual review.
 */
export function KitchenSink() {
  useEffect(() => {
    installPerfMeasurement();
  }, []);

  return (
    <Screen data-testid="kitchen-sink">
      {Array.from({ length: 50 }, (_, row) => (
        <Flex key={row} gap={4}>
          <FlexItem basis={120}>
            <div
              style={{
                height: 40,
                background: row % 2 === 0 ? "#1a1a2e" : "#16213e",
              }}
            />
          </FlexItem>
          <FlexItem grow>
            <div style={{ height: 40, background: "#0f3460" }} />
          </FlexItem>
          <FlexItem basis={80}>
            <div
              style={{
                height: 40,
                background: row % 2 === 0 ? "#16213e" : "#1a1a2e",
              }}
            />
          </FlexItem>
        </Flex>
      ))}
    </Screen>
  );
}
