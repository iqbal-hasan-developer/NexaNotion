-- NexaNotion production-safe starter seed.
-- This file creates the real business categories only. Add products through
-- the protected admin panel so production setup does not publish fake products.

insert into public.categories (name, slug, description, image_url, sort_order, is_active)
values
  ('Ladies Bags', 'ladies-bags', 'Elegant companions for workdays, weekends and celebrations.', '/images/ladies-bag.png', 10, true),
  ('Gym Bags', 'gym-bags', 'Practical, polished carryalls built to keep up with your routine.', '/images/gym-bag.jpg', 20, true),
  ('Cosmetics', 'cosmetics', 'Everyday beauty essentials selected for effortless routines.', '/images/cosmetics.jpg', 30, true),
  ('Bracelets', 'bracelets', 'Delicate details that bring a little shine to every look.', '/images/bracelet.jpg', 40, true),
  ('Couple Packages', 'couple-packages', 'Thoughtful pairings made to celebrate your favorite person.', '/images/couple-package.jpg', 50, true),
  ('Gift Packages', 'gift-packages', 'Beautifully presented surprises for every meaningful moment.', '/images/gift-package.jpg', 60, true),
  ('Panjabi', 'panjabi', 'Premium Panjabi collection for festive, casual and special occasions.', '/images/gift-package.jpg', 70, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
