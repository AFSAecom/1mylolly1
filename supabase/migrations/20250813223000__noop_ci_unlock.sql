-- No-op migration to satisfy CI / plan
DO $$ BEGIN
  PERFORM 1;
END $$;
