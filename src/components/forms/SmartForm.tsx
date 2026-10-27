"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Phone, Send } from "lucide-react";
import { submitInquiry } from "@/app/actions";
import type { FieldConfig, FormId } from "@/lib/forms/definitions";
import { todayInKenya, validateFields, type FieldErrors } from "@/lib/forms/validate";
import { initialFormState, type FormState } from "@/lib/forms/types";
import { trackEvent } from "@/lib/analytics";
import { telHref, whatsappHref } from "@/lib/links";
import { site } from "@/config/site";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { Turnstile } from "./Turnstile";

type SmartFormProps = {
  formId: FormId;
  title: string;
  fields: FieldConfig[];
  submitLabel: string;
  defaults?: Record<string, string>;
};

/** Remounting the inner form (via key) gives a clean slate after a success. */
export function SmartForm(props: SmartFormProps) {
  const [round, setRound] = useState(0);
  return <FormInner key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function FormInner({ formId, title, fields, submitLabel, defaults = {}, onReset }: SmartFormProps & { onReset: () => void }) {
  // The native form action only runs when JavaScript is unavailable; with JavaScript,
  // handleSubmit calls the action directly so network failures can be caught.
  const [nativeState, formAction] = useActionState(submitInquiry, initialFormState);
  const [jsState, setJsState] = useState<FormState>(initialFormState);
  const [pending, startSubmit] = useTransition();
  const state = jsState.status !== "idle" ? jsState : nativeState;
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [startedAt, setStartedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(String(Date.now())), []);

  useEffect(() => {
    if (state.status === "idle") return;
    if (state.status === "error" && state.fieldErrors) {
      setClientErrors(state.fieldErrors);
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else {
      statusRef.current?.focus({ preventScroll: true });
      statusRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [state]);

  const errors = clientErrors;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((f) => [f.name, String(formData.get(f.name) ?? "")]));
    const result = validateFields(fields, values);
    setClientErrors(result.errors);
    const first = Object.keys(result.errors)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    startSubmit(async () => {
      let result: FormState;
      try {
        result = await submitInquiry(initialFormState, formData);
      } catch (error) {
        console.error("[forms] submission request failed", error);
        result = {
          status: "error",
          message:
            typeof navigator !== "undefined" && !navigator.onLine
              ? "You're offline, so nothing was sent. Check your connection and try again."
              : "We could not reach our server. Please try again.",
        };
      }
      setJsState(result);
      trackEvent(result.status === "success" ? "form_submit_success" : "form_submit_error", { form_id: formId });
    });
  }

  function clearError(name: string) {
    if (!clientErrors[name]) return;
    setClientErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function whatsappFallback(): string {
    const data = formRef.current ? new FormData(formRef.current) : null;
    const lines = fields
      .map((f) => [f.label, String(data?.get(f.name) ?? "").trim()] as const)
      .filter(([, v]) => v)
      .map(([label, v]) => `${label}: ${v}`);
    return whatsappHref(`Hello Crystal Fresh Hydrolife, I tried to send a ${title.toLowerCase()} on your website.\n\n${lines.join("\n")}`);
  }

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl bg-linear-to-b from-aqua-50 to-white p-8 text-center ring-1 ring-aqua-200 outline-none sm:p-12"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-aqua-500" aria-hidden="true" />
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Request received</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{state.message}</p>
        <p className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm text-muted ring-1 ring-line">
          Reference&nbsp;<strong className="font-semibold text-ink">{state.reference}</strong>
        </p>
        <p className="mt-6 text-sm text-muted">
          Urgent? Call{" "}
          <a href={telHref} className="font-semibold text-brand-700 underline-offset-4 hover:underline">
            {site.phone.display}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="relative"
    >
      <input type="hidden" name="_form" value={formId} />
      <input type="hidden" name="_ts" value={startedAt} />
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-2xl bg-red-50 p-5 text-sm text-red-900 ring-1 ring-red-200 outline-none"
        >
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">{state.message}</p>
              {!state.fieldErrors && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={whatsappHref()}
                    onClick={(e) => {
                      e.currentTarget.href = whatsappFallback();
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#157a42] px-4 py-2 font-semibold text-white hover:bg-[#106636]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Send these details on WhatsApp
                  </a>
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-red-900 ring-1 ring-red-200 hover:bg-red-100"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call us
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <fieldset disabled={pending} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <legend className="sr-only">{title}</legend>
        {fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            formId={formId}
            error={errors[field.name]}
            defaultValue={defaults[field.name]}
            onChange={() => clearError(field.name)}
          />
        ))}
      </fieldset>

      <div className="mt-6">
        <Turnstile resetSignal={state} />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted sm:max-w-sm">
          <span className="text-brand-600">*</span> Required. Your details are only used to respond. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            privacy notice
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(15_105_168/0.7)] transition hover:bg-brand-700 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              {submitLabel}
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

const controlClasses =
  "block w-full rounded-xl border-0 bg-white px-4 text-[0.95rem] text-ink ring-1 ring-line transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-mist aria-[invalid=true]:ring-red-400";

function Field({
  field,
  formId,
  error,
  defaultValue,
  onChange,
}: {
  field: FieldConfig;
  formId: string;
  error?: string;
  defaultValue?: string;
  onChange: () => void;
}) {
  const id = `${formId}-${field.name}`;
  // Set after mount: statically rendered pages would otherwise carry the build date.
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => {
    if (field.notPast) setMinDate(todayInKenya());
  }, [field.notPast]);
  const describedBy = [error ? `${id}-error` : null, field.hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: field.name,
    required: field.required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onChange,
  };

  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {field.label}
          {field.required && (
            <span className="text-brand-600" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        {field.hint && (
          <span id={`${id}-hint`} className="text-right text-xs text-muted">
            {field.hint}
          </span>
        )}
      </div>

      {field.type === "textarea" ? (
        <textarea
          {...common}
          rows={field.rows ?? 4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          defaultValue={defaultValue}
          className={`${controlClasses} resize-y py-3`}
        />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={defaultValue ?? ""} className={`${controlClasses} h-12 pr-10`}>
          <option value="" disabled={field.required}>
            {field.required ? "Select an option" : "No preference"}
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={field.type}
          maxLength={field.type === "date" ? undefined : field.maxLength ?? 200}
          min={field.type === "date" ? minDate : undefined}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          defaultValue={defaultValue}
          inputMode={field.type === "tel" ? "tel" : undefined}
          className={`${controlClasses} h-12`}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
