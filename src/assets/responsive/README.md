These WebP variants are derived from the four original `../studio-*.jpg` files,
which are retained unchanged. Each image has 640, 1280, and 1920 pixel wide
variants, encoded at quality 82. `src/lib/studio-images.ts` supplies responsive
image attributes; browsers download only the variant they need.

Gallery images 1–4 retain the original gallery order (source photos 1, 3, 4, 2).
The six additional gallery images are detail crops of the existing photographs,
not photographs of other studios.

Crop coordinates below are fractions of the original image dimensions. Crop
width and height use the same fraction to retain the original 3:2 aspect ratio.

| Variant | Original | Left | Top | Width/height |
| --- | --- | --- | --- | --- |
| studio-5 | studio-1.jpg | 0.32 | 0.43 | 0.55 |
| studio-6 | studio-1.jpg | 0.55 | 0.18 | 0.45 |
| studio-7 | studio-2.jpg | 0.40 | 0.04 | 0.55 |
| studio-8 | studio-2.jpg | 0.00 | 0.40 | 0.60 |
| studio-9 | studio-3.jpg | 0.08 | 0.30 | 0.70 |
| studio-10 | studio-4.jpg | 0.00 | 0.10 | 0.65 |
