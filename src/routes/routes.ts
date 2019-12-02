import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import db from "../database";
import { signJWT } from "../utils";
import * as events from "./events";
import login from "./login";
import register from "./register";

export const router = Router();

// unprotected routes
router.post("/api/register/", (req, res) => register(req, res, db, bcrypt, signJWT));
router.post("/api/login/", (req, res) => login(req, res, db, bcrypt, signJWT));
router.post("/api/event/:access_token/", (req, res) => events.create(req, res, db));

// protected route middleware
router.post("/api/events/", (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No authorization token" });
  }
  jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.SECRET_OR_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      next("route");
    }
  });
});

// protected routes
router.post("/api/events/", (req, res, next) => events.get(req, res, db));
