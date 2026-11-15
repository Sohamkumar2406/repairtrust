-- ============================================================================
-- RepairTrust Database Seed - Initial Core Service Categories
-- ============================================================================

INSERT INTO public.service_categories (id, name, slug, description, icon, is_active)
VALUES
    (
        'b7d903a1-4328-4e8c-9821-6571fa089d01',
        'AC Repair',
        'ac-repair',
        'Complete servicing, cooling troubleshooting, gas charging & PCB repairs for split and window ACs.',
        'Wind',
        TRUE
    ),
    (
        'c4e819b2-5439-4f9d-8732-7682eb19ae02',
        'Washing Machine Repair',
        'washing-machine-repair',
        'Expert diagnostics for front-load, top-load & semi-automatic machines across all major brands.',
        'RotateCcw',
        TRUE
    ),
    (
        'd5f920c3-654a-40ae-9843-8793fc2abf03',
        'Laptop Repair',
        'laptop-repair',
        'Chip-level motherboard repair, screen replacements, keyboard fix, battery & data recovery.',
        'Laptop',
        TRUE
    ),
    (
        'e6a031d4-765b-41bf-a954-98a40d3bca04',
        'Refrigerator Repair',
        'refrigerator-repair',
        'Inverter compressor repair, defrost failure fix, thermostat and gas leakage solutions.',
        'Refrigerator',
        TRUE
    ),
    (
        'f7b142e5-876c-42c0-ba65-a9b51e4cdb05',
        'Mobile Repair',
        'mobile-repair',
        'Doorstep screen replacement, charging port fix, microphone/speaker issue & battery refresh.',
        'Smartphone',
        TRUE
    ),
    (
        'a8c253f6-987d-43d1-cb76-bac62f5dec06',
        'Electrical Services',
        'electrical',
        'Certified electricians for short circuit detection, MCB tripping, rewiring & heavy appliance setup.',
        'Zap',
        TRUE
    ),
    (
        'b9d364a7-098e-44e2-dc87-cbd7306efd07',
        'Plumbing Services',
        'plumbing',
        'Prompt fixes for pipe burst, concealed wall leakages, tap fittings, flush tanks & clogged drains.',
        'Wrench',
        TRUE
    ),
    (
        'cae475b8-1a9f-45f3-ed98-dce8417f0e08',
        'TV Repair',
        'tv-repair',
        'Specialized technicians for LED, OLED & 4K Smart TVs: display backlight, power board & HDMI.',
        'Tv',
        TRUE
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    is_active = EXCLUDED.is_active;
