-- Remove trailing 'ml' from ref_complete values
UPDATE product_variants
SET ref_complete = regexp_replace(ref_complete, 'ml$', '')
WHERE ref_complete LIKE '%ml';

