import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const BASE_OPTIONS = {
  USE_PROFILES: { html: true },
  // Uncomment the following lines to customize allowed tags and attributes
  // ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
  // ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  // FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button'],
  // FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
};

export const sanitizeHTML = (html, options = {}) => {
  return DOMPurify.sanitize(html, { ...BASE_OPTIONS, ...options });
};
