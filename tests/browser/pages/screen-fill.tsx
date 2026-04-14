import { Screen } from "eudonia";

export function ScreenFill() {
  return (
    <Screen data-testid="screen">
      <div
        data-testid="content"
        style={{ width: "100%", height: "100%", background: "#1a1a2e" }}
      />
    </Screen>
  );
}
