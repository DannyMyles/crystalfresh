export type FormState =
  | { status: "idle" }
  | { status: "success"; reference: string; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export const initialFormState: FormState = { status: "idle" };
