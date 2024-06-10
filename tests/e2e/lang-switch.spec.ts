import { test, expect } from "@playwright/test";

test("Переключение языка программирования", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByTestId("root")).toHaveAttribute("data-lang", "c");
  await page.getByRole("textbox").locator("div").click();
  await page.getByRole("textbox").fill("<div>hello world</div>");
  await page.getByText("c").click();
  await page.locator("#rc_select_3").fill("html");
  await page.locator("#rc_select_3").press("Enter");
  await expect(page.getByTestId("root")).toHaveAttribute("data-lang", "html");
});
