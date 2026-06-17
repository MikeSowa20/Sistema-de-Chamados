import { memo, useMemo } from "react";
import { sanitizeRichText } from "./richText";

interface RichTextViewProps {
    html: string | null | undefined;
    className?: string;
}

function RichTextView({ html, className = "" }: RichTextViewProps) {
    const safeHtml = useMemo(() => sanitizeRichText(html ?? ""), [html]);

    return (
        <div
            className={`rich-text-content ${className}`}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}

export default memo(RichTextView);
