# Google Sheets submissions log

This keeps a permanent record of every website submission in a Google Sheet, alongside or instead of email. If an email is missed or lands in spam, the order is still in the sheet.

## Setup (about 10 minutes)

1. Create a new Google Sheet, for example **"Crystal Fresh – Website Submissions"**, using the business Google account.
2. In the sheet, open **Extensions → Apps Script**. Delete the sample code and paste in the contents of [`Code.gs`](Code.gs). Save.
3. Choose a long random secret, for example by running `openssl rand -hex 24`.
4. In Apps Script, open **Project Settings → Script properties** and add a property:
   - Property: `WEBHOOK_SECRET`
   - Value: the secret from step 3
5. Click **Deploy → New deployment**, choose the type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Then click **Deploy**, approve the permissions, and copy the **Web app URL**.
6. In your hosting environment variables (and `.env.local`), set:

   ```
   FORM_WEBHOOK_URL=<web app URL>?secret=<your secret>
   ```

   Apps Script cannot read request headers, so the secret goes in the URL. Keep this variable private.
7. Redeploy the website, submit a test from the contact page, and check that a **Messages** tab appears with your test row.

Each form gets its own tab: **Orders**, **Quotations** and **Messages**. If you add new fields to a form, new columns are added automatically.

## Updating the script

After editing `Code.gs`, choose **Deploy → Manage deployments → Edit → Version: New version**. This keeps the same URL.
