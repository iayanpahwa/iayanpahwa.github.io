import satori from "satori";
import sharp from "sharp";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const BG = "#1F2430";
const FG = "#CBCCC6";
const ACCENT = "#FFCD66";
const ORANGE = "#FA8532";

const pngUri = buf => `data:image/png;base64,${buf.toString("base64")}`;

// 1080x1920 Instagram Story, laid out like IG's own "shared post" sticker:
// a floating card over a blurred copy of the cover. The card sits in the upper
// part (below IG's top bar); the lower third is left empty for your own text
// and a Link sticker.
export default async post => {
  const { title, description, author, tags, ogImage, pubDatetime } = post.data;
  const date = pubDatetime.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const tagLine = tags
    .slice(0, 3)
    .map(t => `#${t}`)
    .join("  ");
  const host = new URL(SITE.website).host;
  const meta = `${host} · ${date}`;
  const longTitle = title.length > 70;

  // satori can't decode WebP, so hand it PNG data URIs.
  const src = ogImage?.startsWith("/") ? `public${ogImage}` : null;
  const cover = src
    ? pngUri(await sharp(src).resize(880, 462, { fit: "cover" }).png().toBuffer())
    : null;
  const backdrop = src
    ? pngUri(
        await sharp(src)
          .resize(540, 960, { fit: "cover" })
          .blur(40)
          .modulate({ brightness: 0.45, saturation: 1.2 })
          .png()
          .toBuffer()
      )
    : null;
  const avatar = pngUri(
    await sharp("public/optimized/assets/images/avatar.webp")
      .resize(144, 144, { fit: "cover" })
      .png()
      .toBuffer()
  );

  // flexShrink 0: let nothing squash, so blocks never overlap.
  const el = (type, style, children) => ({
    type,
    props: { style: { flexShrink: 0, ...style }, children },
  });
  const img = (src, width, height, style) => ({
    type: "img",
    props: { src, width, height, style },
  });

  const card = el(
    "div",
    {
      width: 880,
      display: "flex",
      flexDirection: "column",
      background: BG,
      borderRadius: 40,
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    },
    [
      // header row, like an IG post
      el(
        "div",
        { display: "flex", alignItems: "center", padding: "28px 36px" },
        [
          img(avatar, 76, 76, {
            borderRadius: 38,
            border: `3px solid ${ORANGE}`,
          }),
          el("div", { display: "flex", flexDirection: "column", marginLeft: 22 }, [
            el("div", { fontSize: 30, fontWeight: 700, color: "#FFFFFF" }, author),
            el("div", { fontSize: 24, color: FG, opacity: 0.75 }, meta),
          ]),
        ]
      ),
      cover ? img(cover, 880, 462, {}) : el("div", {}, ""),
      el(
        "div",
        { display: "flex", flexDirection: "column", padding: "34px 40px 44px" },
        [
          el("div", { fontSize: 26, color: ORANGE }, tagLine),
          el(
            "div",
            {
              marginTop: 16,
              fontSize: longTitle ? 48 : 56,
              fontWeight: 700,
              lineHeight: 1.15,
              color: ACCENT,
              display: "block",
              lineClamp: longTitle ? 5 : 4,
            },
            title
          ),
          el(
            "div",
            {
              marginTop: 22,
              fontSize: 30,
              lineHeight: 1.4,
              color: FG,
              display: "block",
              lineClamp: 3,
            },
            description
          ),
        ]
      ),
    ]
  );

  const svg = await satori(
    el(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 250,
        background: BG,
        backgroundImage: backdrop ? `url(${backdrop})` : undefined,
        backgroundSize: "1080px 1920px",
        fontFamily: "IBM Plex Mono",
      },
      [card]
    ),
    {
      width: 1080,
      height: 1920,
      embedFont: true,
      fonts: await loadGoogleFonts(author + meta + tagLine + title + description + "…"),
    }
  );
  return svg;
};
