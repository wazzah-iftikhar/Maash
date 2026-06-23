-- Block anonymous reads on all form submission tables.
-- Only the service role key (used in API routes) can read these.

create policy "No anon read on hire_inquiries"
  on hire_inquiries for select using (false);

create policy "No anon read on assessment_individual"
  on assessment_individual for select using (false);

create policy "No anon read on assessment_corporate"
  on assessment_corporate for select using (false);

create policy "No anon read on cv_submissions"
  on cv_submissions for select using (false);
