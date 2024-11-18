import express from "express";
import { Request, Response, NextFunction } from "express";
import { RequestCampaign } from "../types/types.js";

// PrismaClient
import { prisma } from "../prismaclient/prismaclient.js";

const router = express.Router();

// get all campaigns
router.get("/", async (req, res) => {
  try {
    const allCampaign = await prisma.campaign.findMany();
    res.json(allCampaign);
  } catch (error) {
    res.status(400).json({ error: "Unable to get all campaign" });
  }
});

// get campaign by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const currentCampaign = await prisma.campaign.findUnique({
      where: {
        id: id,
      },
    });
    currentCampaign
      ? res.status(200).json(currentCampaign)
      : res.status(404).json({ error: "campaign not found" });
  } catch (error) {
    res.status(400).json({ error: `can not get campaign with id: ${id}` });
  }
});

// create new campaign
router.post("/", async (req: Request<{}, {}, RequestCampaign>, res) => {
  try {
    const {
      companyName,
      companyDescription,
      productDescription,
      targetAudience,
      createdAtDate,
      userId,
      emails,
    } = req.body;
    const newCampaign = await prisma.campaign.create({
      data: {
        companyName,
        companyDescription,
        productDescription,
        targetAudience,
        createdAt: createdAtDate,
        user: { connect: { id: userId } },
        emails: {
          create: emails.map((email) => ({
            subject: email.subject,
            content: email.content,
            recipients: email.recipients,
          })),
        },
      },
      include: {
        emails: true,
        user: true,
      },
      // log: ['query', 'info', 'warn', 'error'],
    });
    res.json(newCampaign);
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    res
      .status(400)
      .json({ error: error.message || "Unable to create campaign" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const {
      companyName,
      companyDescription,
      productDescription,
      targetAudience,
    } = req.body;
    const updateCampaign = await prisma.campaign.update({
      where: {
        id: id,
      },
      data: {
        companyName,
        companyDescription,
        productDescription,
        targetAudience,
      },
    });
    res.json(updateCampaign);
  } catch (error) {
    res.status(400).json({ error: `Unable to update campaign with id: ${id}` });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCampaign = await prisma.campaign.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: `campaign: "${deleteCampaign.companyName}" where deleted`,
    });
  } catch (error) {
    res.status(400).json({ error: `Unable to delete campaign with id: ${id}` });
  }
});

export { router as campaignRoutes };
