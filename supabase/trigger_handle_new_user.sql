-- Database function for 'on_new_user' trigger
-- This handles user initialization (public.user, wallet, profile, role)
BEGIN
  -- 1. Create Public User Record
  INSERT INTO public.user (id, email, avatar_url, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );

  -- 2. Create Economy Wallet
  INSERT INTO public.wallet (user_id, balance)
  VALUES (
    NEW.id,
    0
  );

  -- 3. Create User Profile
  INSERT INTO public.user_profile (user_id)
  VALUES (
    NEW.id
  );

  -- 4. Assign Default Role ('default')
  -- We select the role ID dynamically to be safe
  INSERT INTO public.user_role_junction (user_id, role_id)
  SELECT NEW.id, id 
  FROM public.user_role 
  WHERE name = 'default';
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW; -- Don't block user creation even if this fails
END;
