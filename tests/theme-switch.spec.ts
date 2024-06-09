import { test, expect } from "@playwright/test";

test("Переключение цветовой темы", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByTestId("root")).toBeVisible();
  await expect(page.getByTestId("root")).toHaveAttribute(
    "data-theme",
    "material"
  );
  await page.getByRole("textbox").locator("div").click();
  await page.getByRole("textbox").fill("int main() {}}");

  await page.getByText("material").click();
  await page.locator("#rc_select_2").fill("andromeda");
  await page.locator("#rc_select_2").press("Enter");

  await expect(page.getByTestId("root")).toHaveAttribute(
    "data-theme",
    "andromeda"
  );
});
