"use client";
import { Upload } from "lucide-react";
import { useState } from "react";
export function PhotoInput({
  onChange,
  label = "Add a photo (optional)",
}: {
  onChange: (s: string) => void;
  label?: string;
}) {
  const [preview, setPreview] = useState(""),
    [error, setError] = useState("");
  return (
    <div className="field">
      <span>{label}</span>
      <label className="upload">
        <Upload size={22} />
        <b>{preview ? "Choose another photo" : "Click to upload a photo"}</b>
        <small>JPG or PNG · maximum 5 MB</small>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            setError("");
            const f = e.target.files?.[0];
            if (!f) return;
            if (
              !["image/jpeg", "image/png"].includes(f.type) ||
              f.size > 5242880
            ) {
              setError("Choose a JPG or PNG smaller than 5 MB.");
              setPreview("");
              onChange("");
              e.target.value = "";
              return;
            }
            const r = new FileReader();
            r.onload = () => {
              setPreview(r.result as string);
              onChange(r.result as string);
            };
            r.readAsDataURL(f);
          }}
        />
      </label>
      {preview && (
        <div className="photo-preview">
          <img src={preview} alt="Selected attachment" />
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setPreview("");
              onChange("");
            }}
          >
            Remove photo
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
