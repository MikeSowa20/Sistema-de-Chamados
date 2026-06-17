import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { FaBold, FaImage, FaItalic, FaLink, FaListOl, FaListUl, FaUnlink } from "react-icons/fa";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const onChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const emitirAlteracao = (html: string, imediato = false) => {
        if (onChangeTimeoutRef.current) {
            clearTimeout(onChangeTimeoutRef.current);
            onChangeTimeoutRef.current = null;
        }

        if (imediato) {
            onChange(html);
            return;
        }

        onChangeTimeoutRef.current = setTimeout(() => {
            onChange(html);
            onChangeTimeoutRef.current = null;
        }, 120);
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                autolink: true,
                linkOnPaste: true,
                openOnClick: false,
            }),
            Image.configure({
                allowBase64: true,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "rich-text-editor min-h-36 px-3 py-2 focus:outline-0",
                "data-placeholder": placeholder ?? "",
            },
            handlePaste(view, event) {
                const items = Array.from(event.clipboardData?.items ?? []);
                const imageItem = items.find((item) => item.type.startsWith("image/"));
                const file = imageItem?.getAsFile();

                if (!file) return false;

                const reader = new FileReader();
                reader.onload = () => {
                    const src = String(reader.result);
                    view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src })));
                };
                reader.readAsDataURL(file);

                return true;
            },
        },
        onUpdate({ editor }) {
            emitirAlteracao(editor.getHTML());
        },
        onBlur({ editor }) {
            emitirAlteracao(editor.getHTML(), true);
        },
    });

    useEffect(() => {
        return () => {
            if (onChangeTimeoutRef.current) {
                clearTimeout(onChangeTimeoutRef.current);
            }
        }
    }, []);

    useEffect(() => {
        if (!editor || editor.getHTML() === value) return;

        editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    const definirLink = () => {
        if (!editor) return;

        const linkAtual = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Cole o link", linkAtual ?? "https://");

        if (url === null) return;

        if (!url.trim()) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    }

    const inserirImagem = (arquivo: File) => {
        if (!editor) return;

        const reader = new FileReader();
        reader.onload = () => {
            editor.chain().focus().setImage({ src: String(reader.result) }).run();
            emitirAlteracao(editor.getHTML(), true);
        };
        reader.readAsDataURL(arquivo);
    }

    const botaoClasse = (ativo = false) => (
        `flex h-9 w-9 items-center justify-center border text-sm transition-colors ${ativo ? "border-teal-700 bg-teal-50 text-teal-800" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-950"}`
    );

    if (!editor) return null;

    return (
        <div className="overflow-hidden border border-gray-300 bg-white focus-within:border-teal-700">
            <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <button
                    type="button"
                    title="Negrito"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={botaoClasse(editor.isActive("bold"))}
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    title="Itálico"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={botaoClasse(editor.isActive("italic"))}
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    title="Lista"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={botaoClasse(editor.isActive("bulletList"))}
                >
                    <FaListUl />
                </button>
                <button
                    type="button"
                    title="Lista numerada"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={botaoClasse(editor.isActive("orderedList"))}
                >
                    <FaListOl />
                </button>
                <button
                    type="button"
                    title="Adicionar link"
                    onClick={definirLink}
                    className={botaoClasse(editor.isActive("link"))}
                >
                    <FaLink />
                </button>
                <button
                    type="button"
                    title="Remover link"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className={botaoClasse()}
                >
                    <FaUnlink />
                </button>
                <button
                    type="button"
                    title="Adicionar imagem"
                    onClick={() => fileInputRef.current?.click()}
                    className={botaoClasse()}
                >
                    <FaImage />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                        const arquivo = event.target.files?.[0];
                        if (arquivo) inserirImagem(arquivo);
                        event.target.value = "";
                    }}
                />
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
