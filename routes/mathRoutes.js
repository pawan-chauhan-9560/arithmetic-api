const express = require("express");
const mathController = require("../controllers/mathController");
const authenticate = require("../middleware/authMiddleware");
const trackUsage = require("../middleware/trackUsage");

const router = express.Router();

/**
 * @swagger
 * /api/math/calculate:
 *   get:
 *     summary: Perform an arithmetic operation
 *     description: Computes the result of an arithmetic operation (add, subtract, multiply, divide).
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: operation
 *         required: true
 *         schema:
 *           type: string
 *           enum: [add, subtract, multiply, divide]
 *         description: The arithmetic operation to perform.
 *       - in: query
 *         name: a
 *         required: true
 *         schema:
 *           type: number
 *         description: First number.
 *       - in: query
 *         name: b
 *         required: true
 *         schema:
 *           type: number
 *         description: Second number.
 *     responses:
 *       200:
 *         description: Successful response with calculated result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: add
 *                 a:
 *                   type: number
 *                   example: 5
 *                 b:
 *                   type: number
 *                   example: 3
 *                 result:
 *                   type: number
 *                   example: 8
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid numbers provided."
 *       401:
 *         description: Unauthorized request (API Key missing or invalid).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error while processing request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get(
  "/calculate",
  authenticate,
  trackUsage,
  mathController.performOperation
);

// CRUD Routes
router.get("/", authenticate, trackUsage, mathController.getAll);
router.get("/:id", authenticate, trackUsage, mathController.getById);
router.post("/", authenticate, trackUsage, mathController.create);
router.put("/:id", authenticate, trackUsage, mathController.update);
router.delete("/:id", authenticate, trackUsage, mathController.delete);

module.exports = router;
