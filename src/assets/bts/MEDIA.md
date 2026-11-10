# Homepage studio proof media

Derived locally with FFmpeg 9.0.2. The three supplied originals are unchanged;
no portraits were uploaded or sent to an image service.

| Asset | Properties |
| --- | --- |
| `broll.MP4` (original) | 48,890,788 bytes; HEVC Main 10; 3840×2160; 30000/1001 fps; BT.709; video 6.873533 s (container 6.890667 s); video bitrate 52.58 Mb/s; AAC audio |
| `broll-web.mp4` | 6,481,996 bytes; H.264 High Level 4.1; 1920×1080; 30000/1001 fps; yuv420p; 6.473133 s; 8.01 Mb/s overall; no audio/data/metadata; faststart verified |
| `broll-web-mobile.mp4` | 2,670,762 bytes; H.264 High Level 3.1; 1280×720; same frame rate/loop; 3.30 Mb/s; yuv420p; no audio/data; faststart verified |
| `broll-poster.webp` | Actual source frame at 6 s; 1920×1080; quality 90; 214,596 bytes |
| `broll-poster-mobile.webp` | Same actual frame; 960×540; quality 90; 94,382 bytes |
| `Remy.jpeg` (original) | 2218×2957; black and white; primary portrait |
| `Ref.jpeg` (original) | 2327×3103; black and white; secondary portrait |
| `remy-640.webp`, `remy-960.webp` | Responsive primary portrait, quality 90; 97,508 / 171,884 bytes |
| `ref-640.webp`, `ref-960.webp` | Responsive secondary portrait, quality 90; 84,602 / 148,358 bytes |

The source pans from a camera monitor to guests at the table, so it does not
naturally loop. The derivative begins 12 frames into the source and crossfades
the final 12 frames into the opening 12 frames (0.4004 s). Its end then meets
its beginning without the original hard jump. This is a brief dissolve, not a
perfectly matched camera move. The source's focus changes and motion blur remain.

Encoding command (run from the repository root with FFmpeg on PATH):

```powershell
ffmpeg -n -i src/assets/bts/broll.MP4 -filter_complex_threads 2 -filter_complex '[0:v:0]scale=1920:1080:flags=lanczos,setsar=1,split=2[body][head];[body]trim=start_frame=12,setpts=PTS-STARTPTS[main];[head]trim=end_frame=12,setpts=PTS-STARTPTS[intro];[main][intro]xfade=transition=fade:duration=0.4004:offset=6.072733,format=yuv420p[out]' -map '[out]' -an -sn -dn -map_metadata -1 -c:v libx264 -preset slow -crf 19 -profile:v high -level:v 4.1 -refs 4 -g 60 -fps_mode cfr -movflags +faststart src/assets/bts/broll-web.mp4
```

Poster: extract the source at 6 s, scale to 1920×1080 using Lanczos, encode
one frame with `libwebp -quality 90`. Portraits: scale each original to widths
640 and 960 with proportional even height (`scale=WIDTH:-2:flags=lanczos`),
encode with the same WebP quality. Do not overwrite the originals.

The mobile video uses the same command/filter directly from the original,
changing scale to `1280:720`, CRF to 20 and level to 3.1. It is 59% smaller than
the desktop export. The mobile poster uses `scale=960:540` at quality 90 (56%
smaller). Desktop derivatives are unchanged. Widths below 768 px select the
mobile MP4 once, on approach; resizing does not download a second video.
The poster uses a media-query picture source with the same mobile breakpoint.

No suitable local background-removal model was installed. Detailed hair, hands
and studio backgrounds favor intact editorial frames over an unreliable cutout.
The primary portrait is larger; the supporting portrait is offset on the opposite
side. Their original monochrome appearance is retained.

`StudioProof` appears directly after `Hero` and before `Motto`. The MP4 source is
attached within 200 px of its viewport, plays only while visible, and pauses when
offscreen, the tab is hidden, or the visitor pauses it. Reduced motion uses the
real poster with no video request. Autoplay restrictions and video errors leave
the poster and booking action available; a small custom play/pause button
supports browser autoplay refusal and accessible motion control.
The poster and both portrait source sets are also attached only on approach;
native image lazy-loading alone fetched these too early on mobile. Media keeps
its reserved geometry before sources are attached. Reduced-motion visitors still
receive the appropriate real poster and portraits, without requesting video.
A seek-to-start safeguard resumes native loops on WebKit builds that pause at
the boundary, only while visible and with no user pause or reduced motion.
