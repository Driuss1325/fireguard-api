import { Router } from "express";
import { authJwt } from "../middleware/authJwt.js";
import {
  publicList,
  publicCreate,
  adminHide,
  publicCreateComment,
  adminHideComment,
} from "../controllers/community.controller.js";

const r = Router();

/**
 * @openapi
 * /api/community/public:
 *   get:
 *     summary: Listar posts públicos (visibles) con comentarios visibles
 *     tags:
 *       - Community
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Crear post público (sin login)
 *     tags:
 *       - Community
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorName
 *             properties:
 *               authorName:
 *                 type: string
 *               content:
 *                 type: string
 *                 description: "Texto opcional si se adjunta imagen"
 *               imageBase64:
 *                 type: string
 *                 description: "Solo el payload Base64 (sin data:...)"
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       201:
 *         description: Creado
 */
r.get("/public", publicList);
r.post("/public", publicCreate);

/**
 * @openapi
 * /api/community/{id}/hide:
 *   post:
 *     summary: Ocultar post (requiere login)
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/:id/hide", authJwt, adminHide);

/**
 * @openapi
 * /api/community/{postId}/comments:
 *   post:
 *     summary: Crear comentario público en un post (sin login)
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorName
 *             properties:
 *               authorName:
 *                 type: string
 *               content:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *                 description: "Solo Base64 (sin prefijo data:...)"
 *     responses:
 *       201:
 *         description: Creado
 */
r.post("/:postId/comments", publicCreateComment);

/**
 * @openapi
 * /api/community/comments/{id}/hide:
 *   post:
 *     summary: Ocultar comentario (requiere login)
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/comments/:id/hide", authJwt, adminHideComment);

export default r;
