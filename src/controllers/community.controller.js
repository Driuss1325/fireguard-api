import { CommunityPost, CommunityComment } from "../models/index.js";

// Valida tamaño de base64 (aprox) para no aceptar > 5MB
function validateBase64Image(b64, maxMB = 5) {
  if (!b64) return true;
  try {
    const sizeInBytes = Buffer.byteLength(b64, "base64");
    return sizeInBytes <= maxMB * 1024 * 1024;
  } catch {
    return false;
  }
}

export async function publicList(req, res) {
  const posts = await CommunityPost.findAll({
    where: { status: "visible" },
    order: [["createdAt", "DESC"]],
    limit: 200,
    include: [
      {
        model: CommunityComment,
        as: "comments",
        where: { status: "visible" },
        required: false,
        order: [["createdAt", "ASC"]],
      },
    ],
  });
  res.json(posts);
}

export async function publicCreate(req, res) {
  const { authorName, content, lat, lng, imageBase64 } = req.body;
  if (!authorName || (!content && !imageBase64)) {
    return res
      .status(400)
      .json({ error: "authorName y content o imagen son requeridos" });
  }
  if (imageBase64 && !validateBase64Image(imageBase64, 5)) {
    return res.status(413).json({ error: "Imagen demasiado grande (máx 5MB)" });
  }

  const post = await CommunityPost.create({
    authorName,
    content: content || "",
    imageBase64: imageBase64 || null,
    lat,
    lng,
    status: "visible",
  });
  res.status(201).json(post);
}

export async function adminHide(req, res) {
  const { id } = req.params;
  const post = await CommunityPost.findByPk(id);
  if (!post) return res.status(404).json({ error: "No encontrado" });
  post.status = "hidden";
  await post.save();
  res.json({ ok: true });
}

// ---- Comentarios ----
export async function publicCreateComment(req, res) {
  const { postId } = req.params;
  const { authorName, content, imageBase64 } = req.body;

  const post = await CommunityPost.findByPk(postId);
  if (!post || post.status !== "visible") {
    return res.status(404).json({ error: "Post no encontrado" });
  }
  if (!authorName || (!content && !imageBase64)) {
    return res
      .status(400)
      .json({ error: "authorName y content o imagen son requeridos" });
  }
  if (imageBase64 && !validateBase64Image(imageBase64, 5)) {
    return res.status(413).json({ error: "Imagen demasiado grande (máx 5MB)" });
  }

  const c = await CommunityComment.create({
    postId: post.id,
    authorName,
    content: content || "",
    imageBase64: imageBase64 || null,
    status: "visible",
  });

  res.status(201).json(c);
}

export async function adminHideComment(req, res) {
  const { id } = req.params;
  const c = await CommunityComment.findByPk(id);
  if (!c) return res.status(404).json({ error: "No encontrado" });
  c.status = "hidden";
  await c.save();
  res.json({ ok: true });
}
