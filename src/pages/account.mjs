/* Sign up · Log in · Forgot password · Account (orders) · Addresses · Wishlist */
import { page, breadcrumbs, ICONS, CFG } from "../layout.mjs";

const authPage = ({ path, title, description, h1, lede, form, foot }) => ({ path, html: page({ title, description, path, noindex: true, body: `
<section class="auth"><div class="wrap"><h1>${h1}</h1><p class="lede">${lede}</p><div class="form-card">${form}</div><p class="form__foot center" style="margin-top:var(--s-5)">${foot}</p></div></section>` }) });

const signup = () => authPage({
  path: "/account/signup/", title: "Create an account", description: "Create a Functional Elixirs account to track orders, save addresses and keep a wishlist. Takes thirty seconds.",
  h1: "Create your account", lede: "Orders, addresses and your saved jars — in one quiet place.",
  form: `<form id="signup-form" class="form" novalidate>
    <div class="field"><label for="su-name">Full name</label><input class="input" id="su-name" name="name" autocomplete="name" required><p class="error">Please enter your name.</p></div>
    <div class="field"><label for="su-email">Email</label><input class="input" id="su-email" name="email" type="email" autocomplete="email" required inputmode="email"><p class="error">Enter a valid email address.</p></div>
    <div class="field"><label for="su-pass">Password</label><input class="input" id="su-pass" name="password" type="password" autocomplete="new-password" minlength="8" required><p class="help">At least 8 characters.</p><p class="error">Use at least 8 characters.</p></div>
    <label class="check"><input type="checkbox" name="news" checked> Send me the monthly note from the kitchen</label>
    <p class="form-msg" role="alert"></p>
    <button class="btn btn--primary btn--block" type="submit">Create account</button>
    <p class="form__foot center">By continuing you agree to our <a href="/terms/">Terms</a> and <a href="/privacy/">Privacy Policy</a>.</p></form>`,
  foot: `Already have an account? <a href="/account/login/">Log in</a>`,
});

const login = () => authPage({
  path: "/account/login/", title: "Log in", description: "Log in to your Functional Elixirs account to see orders, addresses and wishlist.",
  h1: "Welcome back", lede: "Log in to see your orders and saved jars.",
  form: `<form id="login-form" class="form" novalidate>
    <div class="field"><label for="li-email">Email</label><input class="input" id="li-email" name="email" type="email" autocomplete="email" required inputmode="email"><p class="error">Enter a valid email address.</p></div>
    <div class="field"><label for="li-pass">Password</label><input class="input" id="li-pass" name="password" type="password" autocomplete="current-password" required><p class="error">Enter your password.</p></div>
    <div class="cluster" style="justify-content:space-between"><label class="check"><input type="checkbox" name="remember" checked> Keep me logged in</label><a class="small" href="/account/forgot-password/">Forgot password?</a></div>
    <button class="btn btn--primary btn--block" type="submit">Log in</button></form>`,
  foot: `New here? <a href="/account/signup/">Create an account</a> · or <a href="/checkout/">check out as a guest</a>`,
});

const forgot = () => authPage({
  path: "/account/forgot-password/", title: "Reset your password", description: "Reset your Functional Elixirs account password.",
  h1: "Reset password", lede: "Enter your email and we’ll send a link to choose a new one.",
  form: `<form id="forgot-form" class="form" novalidate>
    <div class="field"><label for="fp-email">Email</label><input class="input" id="fp-email" name="email" type="email" autocomplete="email" required inputmode="email"><p class="error">Enter a valid email address.</p></div>
    <p class="form-msg" role="status"></p>
    <button class="btn btn--primary btn--block" type="submit">Send reset link</button></form>`,
  foot: `<a href="/account/login/">Back to log in</a>`,
});

const shell = (view, path, title, description, h1) => ({ path, html: page({ title, description, path, noindex: true, body: `${breadcrumbs([{ name: "Account", href: "/account/" }, ...(view === "orders" ? [] : [{ name: h1, href: path }])])}
<div class="wrap page-head"><p class="eyebrow">Account</p><h1>${h1}</h1></div>
<section class="section--tight"><div class="wrap account">
  <nav class="account__nav" aria-label="Account">
    <a href="/account/" ${view === "orders" ? 'aria-current="page"' : ""}>Orders</a>
    <a href="/account/addresses/" ${view === "addresses" ? 'aria-current="page"' : ""}>Addresses</a>
    <a href="/account/wishlist/" ${view === "wishlist" ? 'aria-current="page"' : ""}>Wishlist</a>
    <a href="/track-order/">Track an order</a>
    <a href="/shop/">Shop</a>
    <a href="#" class="signout" data-signout>Sign out</a>
  </nav>
  <div data-account="${view}"></div>
</div></section>` }) });

export default () => [
  signup(), login(), forgot(),
  shell("orders", "/account/", "Your account", "Your Functional Elixirs account — orders, addresses and wishlist.", "Your account"),
  shell("addresses", "/account/addresses/", "Addresses", "Manage your saved shipping addresses.", "Addresses"),
  shell("wishlist", "/account/wishlist/", "Wishlist", "Your saved Functional Elixirs products.", "Wishlist"),
];
