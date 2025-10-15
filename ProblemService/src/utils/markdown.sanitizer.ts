import { marked } from "marked";
import sanitizeHtml from "sanitize-html"
import logger from "../config/logger.config"
import TurndownService from "turndown";

export async function sanitize(markdown: string): Promise<string> {

  if(!sanitize || typeof(markdown) !== "string") {
    return ""
  }

  try {
    const convertedHtml= await marked.parse(markdown);  // converts the string(req body) into html

    const sanitizedHtml= await sanitizeHtml(convertedHtml , {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "pre", "code"]),
      allowedAttributes: {
        "img": ["src", "alt", "title"],
        "code": ["class"],
        "pre": ["class"],
        "a": ["href", "target"]
      },
      allowedSchemes: ["http", "https"],
      allowedSchemesByTag: {
        "img": ["http", "https"],
      }
    });

    const tds= new TurndownService();

    return tds.turndown(sanitizedHtml);
  } catch (error) {
    logger.error("Error while sanitizing the markdown", error);
    return "";
  }

}