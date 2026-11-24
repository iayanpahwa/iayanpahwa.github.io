import satori from "satori";
import sharp from "sharp";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const BG = "#1F2430";
const FG = "#CBCCC6";
const ACCENT = "#FFCD66";
const ORANGE = "#FA8532";

// 1080x1920 Instagram Story card. Content stays inside y 220..1700 so the
// IG header and reply bar don't cover it.
export default async (post, postPath) => {
  const { title, description, author, tags, ogImage, pubDatetime } = post.data;
  const url = `${new URL(SITE.website).host}${postPath}`;
  const date = pubDatetime.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const tagLine = tags
    .slice(0, 3)
    .map(t => `#${t}`)
    .join("  ");
  const byline = `by ${author} · ${date}`;

  // satori can't decode WebP, so hand it a PNG data URI.
  let cover = null;
  if (ogImage && ogImage.startsWith("/")) {
    const png = await sharp(`public${ogImage}`)
      .resize(920, 484, { fit: "cover" })
      .png()
      .toBuffer();
    cover = `data:image/png;base64,${png.toString("base64")}`;
  }

  // flexShrink 0: let nothing squash, so blocks never overlap.
  const el = (type, style, children) => ({
    type,
    props: { style: { flexShrink: 0, ...style }, children },
  });

  const svg = await satori(
    el(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        backgroundImage: `radial-gradient(circle at 85% 8%, rgba(250,133,50,0.35), transparent 45%), radial-gradient(circle at 10% 95%, rgba(255,205,102,0.22), transparent 45%)`,
        padding: "220px 80px 220px",
        color: FG,
        fontFamily: "IBM Plex Mono",
      },
      [
        el(
          "div",
          { fontSize: 34, fontWeight: 700, color: ORANGE, letterSpacing: 4 },
          SITE.title.toUpperCase()
        ),
        cover
          ? {
              type: "img",
              props: {
                src: cover,
                width: 920,
                height: 484,
                style: {
                  marginTop: 40,
                  borderRadius: 28,
                  border: `3px solid ${ORANGE}`,
                },
              },
            }
          : el("div", { height: 40 }, ""),
        el(
          "div",
          { marginTop: 48, fontSize: 30, color: ORANGE },
          tagLine
        ),
        el(
          "div",
          {
            marginTop: 20,
            // Long titles get a smaller size and an extra line instead of "…".
            fontSize: title.length > 70 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.15,
            color: ACCENT,
            display: "block",
            lineClamp: title.length > 70 ? 5 : 4,
          },
          title
        ),
        el(
          "div",
          {
            marginTop: 32,
            fontSize: 36,
            lineHeight: 1.4,
            display: "block",
            lineClamp: cover ? 3 : 7,
          },
          description
        ),
        el("div", { marginTop: 28, fontSize: 28, opacity: 0.7 }, byline),
        el("div", { flexGrow: 1 }, ""),
        el(
          "div",
          {
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            padding: "28px 36px",
            borderRadius: 24,
            border: `3px solid ${ACCENT}`,
            background: "rgba(255,205,102,0.08)",
          },
          [
            el(
              "div",
              { fontSize: 30, fontWeight: 700, color: ACCENT },
              "Read the full post"
            ),
            el(
              "div",
              { marginTop: 8, fontSize: 28, wordBreak: "break-all" },
              url
            ),
          ]
        ),
      ]
    ),
    {
      width: 1080,
      height: 1920,
      embedFont: true,
      fonts: await loadGoogleFonts(
        SITE.title.toUpperCase() +
          tagLine +
          title +
          description +
          byline +
          "Read the full post…" +
          url
      ),
    }
  );
  return svg;
};
