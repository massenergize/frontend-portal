import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_KEY

function MERichTextEditor({
  onChange,
  value,
  defaultValue,
  initialValue,
  onMount,
  _generics,
}) {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnChange = (text) => {
    setContent(text);
    onChange && onChange(text);
  };
  const resetEditor = () => {
    setContent("");
  };

  useEffect(() => {
    onMount && onMount(resetEditor);
  }, [onMount]);

  useEffect(() => {
    if (content === "") setContent(value || defaultValue || initialValue || "");
  }, [value, defaultValue, initialValue, content]);

  return (
    <>
      {loading && (
        <center style={{ width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>
            <i className="fa fa-spin" style={{ marginRight: 5 }} />
            Loading...
          </span>
        </center>
      )}

      <Editor
        {...(_generics || {})}
        onInit={(_, editor) => {
          editorRef.current = editor;
          setLoading(false);
        }}
        // initialValue={value || defaultValue || initialValue}
        value={content}
        onEditorChange={handleOnChange}
        init={{
          height: 350,
          menubar: false,
          default_link_target: "_blank",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor forecolor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | link | image | bullist numlist outdent indent |  fontselect | fontsizeselect",
        }}
        apiKey={TINY_MCE_API_KEY}
      />
    </>
  );
}

export default MERichTextEditor;
