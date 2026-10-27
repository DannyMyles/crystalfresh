import { beforeEach, describe, expect, it, vi } from "vitest";

const smtp = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));
vi.mock("nodemailer", () => ({ createTransport: smtp.createTransport, default: { createTransport: smtp.createTransport } }));
import {
  deliverSubmission,
  DeliveryNotConfiguredError,
  sendAcknowledgement,
  type Submission,
} from "@/lib/forms/deliver";

const submission: Submission = {
  reference: "CFH-270301-ABC12",
  formId: "contact",
  formTitle: "Contact message",
  subject: "New website message: Jane",
  submittedAt: "2027-03-01T08:00:00.000Z",
  replyTo: "jane@example.com",
  fields: [
    { name: "name", label: "Your name", value: "Jane <script>alert(1)</script>" },
    { name: "message", label: "Message", value: "Please call me & confirm" },
    { name: "email", label: "Email address", value: "" },
  ],
};

type Call = { url: string; init: RequestInit; body: Record<string, unknown> };

function mockFetch(respond: (url: string) => Response = () => Response.json({ id: "email_1" })) {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init, body: JSON.parse(init.body as string) });
      return respond(url);
    }),
  );
  return calls;
}

beforeEach(() => {
  for (const key of ["RESEND_API_KEY", "INQUIRY_TO_EMAIL", "INQUIRY_FROM_EMAIL", "FORM_WEBHOOK_URL", "FORM_WEBHOOK_SECRET", "SEND_CUSTOMER_CONFIRMATION", "SMTP_USER", "SMTP_PASSWORD", "SMTP_HOST", "SMTP_PORT"]) {
    vi.stubEnv(key, "");
  }
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("deliverSubmission", () => {
  it("refuses to pretend success when no channel is configured", async () => {
    await expect(deliverSubmission(submission)).rejects.toBeInstanceOf(DeliveryNotConfiguredError);
  });

  it("sends a Resend email in the documented API format", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_TO_EMAIL", "a@example.com, b@example.com");
    const calls = mockFetch();

    expect(await deliverSubmission(submission)).toEqual([{ channel: "email", ok: true }]);

    const { url, init, body } = calls[0];
    const headers = init.headers as Record<string, string>;
    expect(url).toBe("https://api.resend.com/emails");
    expect(headers.Authorization).toBe("Bearer re_test");
    expect(headers["Idempotency-Key"]).toBe(submission.reference);
    expect(body.to).toEqual(["a@example.com", "b@example.com"]);
    expect(body.reply_to).toBe("jane@example.com");
    expect(body.from).toContain("onboarding@resend.dev");
    expect(body.subject).toBe("New website message: Jane – CFH-270301-ABC12");
    expect(body.html).toContain("Jane &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(body.html).not.toContain("<script>");
    expect(body.text).toContain("Message: Please call me & confirm");
    expect(body.text).not.toContain("Email address:");
  });

  it("defaults the recipient to the business email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const calls = mockFetch();
    await deliverSubmission(submission);
    expect(calls[0].body.to).toEqual(["muhadiwawire@gmail.com"]);
  });

  it("reports a failed email channel", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    mockFetch(() => new Response("invalid from address", { status: 422 }));
    expect(await deliverSubmission(submission)).toEqual([{ channel: "email", ok: false }]);
  });

  it("posts JSON to the webhook with the shared secret", async () => {
    vi.stubEnv("FORM_WEBHOOK_URL", "https://hooks.example.com/in");
    vi.stubEnv("FORM_WEBHOOK_SECRET", "s3cret");
    const calls = mockFetch(() => new Response("ok"));

    expect(await deliverSubmission(submission)).toEqual([{ channel: "webhook", ok: true }]);
    expect((calls[0].init.headers as Record<string, string>)["X-Webhook-Secret"]).toBe("s3cret");
    expect(calls[0].body.reference).toBe(submission.reference);
    expect(calls[0].body.data).toMatchObject({ name: submission.fields[0].value, message: "Please call me & confirm" });
  });

  it("treats a 200 response with ok:false (Google Apps Script) as a failure", async () => {
    vi.stubEnv("FORM_WEBHOOK_URL", "https://script.google.com/exec?secret=x");
    mockFetch(() => Response.json({ ok: false, error: "unauthorized" }));
    expect(await deliverSubmission(submission)).toEqual([{ channel: "webhook", ok: false }]);
  });

  it("succeeds when one of two channels fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("FORM_WEBHOOK_URL", "https://hooks.example.com/in");
    mockFetch((url) => (url.includes("resend") ? new Response("down", { status: 500 }) : Response.json({ ok: true })));
    const results = await deliverSubmission(submission);
    expect(results).toContainEqual({ channel: "email", ok: false });
    expect(results).toContainEqual({ channel: "webhook", ok: true });
  });
});

describe("sendAcknowledgement", () => {
  it("is skipped while using Resend's test sender, which cannot reach customers", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "Crystal Fresh <onboarding@resend.dev>");
    const calls = mockFetch();
    await sendAcknowledgement(submission);
    expect(calls).toHaveLength(0);
  });

  it("is skipped when the customer gave no email or it is switched off", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "orders@crystalfresh.example");
    const calls = mockFetch();
    await sendAcknowledgement({ ...submission, replyTo: undefined });
    vi.stubEnv("SEND_CUSTOMER_CONFIRMATION", "false");
    await sendAcknowledgement(submission);
    expect(calls).toHaveLength(0);
  });

  it("sends a receipt with the reference but never echoes the customer's message", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "orders@crystalfresh.example");
    const calls = mockFetch();
    await sendAcknowledgement(submission);

    const { body, init } = calls[0];
    expect(body.to).toEqual(["jane@example.com"]);
    expect(body.reply_to).toBe("muhadiwawire@gmail.com");
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe("CFH-270301-ABC12-ack");
    expect(body.text).toContain("CFH-270301-ABC12");
    expect(`${body.text}${body.html}`).not.toContain("Please call me");
    expect(`${body.text}${body.html}`).not.toContain("script");
  });

  it("never throws, so a failed receipt cannot undo a successful submission", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "orders@crystalfresh.example");
    mockFetch(() => new Response("error", { status: 500 }));
    await expect(sendAcknowledgement(submission)).resolves.toBeUndefined();
  });
});

describe("Gmail / SMTP email", () => {
  beforeEach(() => {
    smtp.sendMail.mockReset().mockResolvedValue({ messageId: "1" });
    smtp.createTransport.mockReset().mockReturnValue({ sendMail: smtp.sendMail });
    vi.stubEnv("SMTP_USER", "shop@gmail.com");
    vi.stubEnv("SMTP_PASSWORD", "abcd efgh ijkl mnop");
  });

  it("sends through Gmail by default, removing spaces from the app password", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const calls = mockFetch();
    expect(await deliverSubmission(submission)).toEqual([{ channel: "email", ok: true }]);
    expect(calls).toHaveLength(0);

    expect(smtp.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: "shop@gmail.com", pass: "abcdefghijklmnop" } }),
    );
    const mail = smtp.sendMail.mock.calls[0][0];
    expect(mail.from).toBe("Crystal Fresh Hydrolife Website <shop@gmail.com>");
    expect(mail.to).toEqual(["muhadiwawire@gmail.com"]);
    expect(mail.replyTo).toBe("jane@example.com");
    expect(mail.subject).toBe("New website message: Jane – CFH-270301-ABC12");
    expect(mail.html).not.toContain("<script>");
  });

  it("reports a failure when Gmail rejects the login", async () => {
    smtp.sendMail.mockRejectedValue(new Error("535 Username and Password not accepted"));
    expect(await deliverSubmission(submission)).toEqual([{ channel: "email", ok: false }]);
  });

  it("sends the customer a receipt from the Gmail address", async () => {
    await sendAcknowledgement(submission);
    const mail = smtp.sendMail.mock.calls[0][0];
    expect(mail.to).toEqual(["jane@example.com"]);
    expect(mail.replyTo).toBe("muhadiwawire@gmail.com");
    expect(mail.text).toContain("CFH-270301-ABC12");
    expect(`${mail.text}${mail.html}`).not.toContain("Please call me");
  });
});
