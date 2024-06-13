import { expect, test } from "@playwright/test";

const comment = "Комментарий 1";
const code = "int main() {}";

test("Сохранение кода и комментариев", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("textbox").locator("div").click();
  await page.getByRole("textbox").fill(code);
  await page.getByText(code).click();
  await page.getByRole("button").nth(2).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill(comment);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await page.getByRole("button").nth(1).click();
  await page.goto(
    "http://localhost:5173/?c=eJyrVipLzClNVbJSyswrUchNzMzT0FSorlXSUUrOz81NzSspVrKKrlbKycwDqjHUUSpJrSgBKr4w68K%2BC3uAcOuFvRebLmy42HBhx4WdCoZKtbE6SjmJeelANclAQ0oyUnNBhucmlqQWZSbmKNUCAMHMLQY%3D"
  );
  await expect(page.getByText(code)).toBeVisible();
  await page.getByRole("button").first().click();
  await expect(page.getByText(comment)).toBeVisible();
});
