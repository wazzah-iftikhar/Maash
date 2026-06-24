-- Block anonymous reads on all form submission tables.
create policy "No anon read on hire_inquiries"
  on hire_inquiries for select using (false);

create policy "No anon read on assessment_individual"
  on assessment_individual for select using (false);

create policy "No anon read on assessment_corporate"
  on assessment_corporate for select using (false);

create policy "No anon read on cv_submissions"
  on cv_submissions for select using (false);

-- Allow logged-in admin to read all tables
create policy "Authenticated read hire_inquiries"
  on hire_inquiries for select to authenticated using (true);

create policy "Authenticated read assessment_individual"
  on assessment_individual for select to authenticated using (true);

create policy "Authenticated read assessment_corporate"
  on assessment_corporate for select to authenticated using (true);

create policy "Authenticated read cv_submissions"
  on cv_submissions for select to authenticated using (true);

-- Allow logged-in admin full access to jobs
create policy "Authenticated full access jobs"
  on jobs for all to authenticated using (true) with check (true);
