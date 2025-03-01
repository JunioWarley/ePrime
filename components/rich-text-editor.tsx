import type React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  initialValue: string
  onChange: (content: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={initialValue}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      }}
    />
  )
}

