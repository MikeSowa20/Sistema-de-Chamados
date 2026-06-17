const allowedTags = new Set([
    "A",
    "B",
    "BLOCKQUOTE",
    "BR",
    "CODE",
    "EM",
    "I",
    "IMG",
    "LI",
    "OL",
    "P",
    "PRE",
    "STRONG",
    "UL",
]);

const isSafeUrl = (url: string) => {
    return /^(https?:|mailto:|tel:)/i.test(url);
}

const isSafeImageSource = (src: string) => {
    return /^(https?:|data:image\/(png|jpeg|jpg|gif|webp);base64,)/i.test(src);
}

export const sanitizeRichText = (html: string) => {
    if (!html || typeof window === "undefined") return "";

    const parser = new DOMParser();
    const documentHtml = parser.parseFromString(html, "text/html");

    const sanitizeNode = (node: Node) => {
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const element = child as HTMLElement;

                if (!allowedTags.has(element.tagName)) {
                    sanitizeNode(element);
                    element.replaceWith(...Array.from(element.childNodes));
                    return;
                }

                Array.from(element.attributes).forEach((attribute) => {
                    const name = attribute.name.toLowerCase();
                    const value = attribute.value;

                    if (element.tagName === "A" && name === "href" && isSafeUrl(value)) {
                        element.setAttribute("target", "_blank");
                        element.setAttribute("rel", "noreferrer");
                        return;
                    }

                    if (element.tagName === "IMG" && name === "src" && isSafeImageSource(value)) {
                        return;
                    }

                    if (["alt", "title"].includes(name)) return;

                    element.removeAttribute(attribute.name);
                });

                sanitizeNode(element);
            }
        });
    }

    sanitizeNode(documentHtml.body);

    return documentHtml.body.innerHTML;
}

export const isRichTextEmpty = (html: string) => {
    if (!html) return true;
    if (/<img[\s>]/i.test(html)) return false;

    const parser = typeof window !== "undefined" ? new DOMParser() : null;
    const text = parser
        ? parser.parseFromString(html, "text/html").body.textContent ?? ""
        : html.replace(/<[^>]+>/g, "");

    return text.replace(/\u00a0/g, " ").trim().length === 0;
}
