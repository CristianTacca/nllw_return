import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export const routes = express.Router();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4c00c6e4714c4a",
    pass: "c4529c709b20cc",
  },
});

routes.post("/feedback", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const new_feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Cristian Tacca <christacca@gmail.com>",
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
      `<p>Tipo do Feedback: ${type} </p>`,
      `<p>Comentario: ${comment} </p>`,
      `</div>`,
    ].join(""),
  });

  return res.status(201).json({ data: new_feedback });
});
