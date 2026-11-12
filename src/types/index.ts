export type Theme = "light" | "dark" | "system";

export type NavItem = {
  label: string;
  href: string;
};

export type ActionSuccess<T> = {
  ok: true;
  data: T;
};

export type ActionFailure = {
  ok: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;
